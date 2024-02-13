import { Injectable, inject } from '@angular/core';
import { EMPTY, Observable, filter, finalize, map, switchMap, tap } from 'rxjs';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { concatLatestFrom } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { NzMessageService } from 'ng-zorro-antd/message';
import { User } from '@core/models/user.model';
import { AuthActions } from '@core/states/auth/auth.actions';
import { FileDetail } from '@shared/models/filedetail.model';
import { UsersApiService } from '@modules/users/services/users.api-service';

interface UserInfoState {
  loading: boolean;
  user?: User | null;
}

const UserInfoInitialState: UserInfoState = {
  loading: false,
};

@Injectable()
export class UserInfoComponentStore extends ComponentStore<UserInfoState> {
  private _store = inject(Store);
  private _messageService = inject(NzMessageService);
  private _usersApiService = inject(UsersApiService);

  constructor() {
    super(UserInfoInitialState);
  }

  // #region SELECTORS
  readonly userId$ = this.select((state) => state.user?.id);

  readonly loading$ = this.select((state) => state.loading);

  readonly avatar$ = this.select((state) => state.user?.avatar);
  // #endRegion

  // #region REDUCERS
  readonly setLoading = this.updater((state, loading: boolean) => ({
    ...state,
    loading,
  }));

  readonly setUser = this.updater((state, user: User | null | undefined) => ({
    ...state,
    user,
  }));

  readonly setAvatar = this.updater((state, avatar: FileDetail) => {
    return state.user
      ? {
          ...state,
          user: {
            ...state.user,
            avatar,
          },
        }
      : state;
  });
  // #endRegion

  // #region EFFECTS
  readonly uploadAvatar = this.effect((event$: Observable<Event>) =>
    event$.pipe(
      tap(() => this.setLoading(true)),
      concatLatestFrom(() => this.userId$),
      switchMap(([event, id]) => {
        const files = (<HTMLInputElement>event.target).files;

        if (id && files) {
          return this._usersApiService.updateUserAvatar(id, files[0]).pipe(
            tapResponse(
              (response) => {
                this.setAvatar(response.data);
                this._store.dispatch(
                  AuthActions.updateAvatar({ avatar: response.data })
                );
                if (response.message)
                  this._messageService.success(response.message);
              },
              () => undefined
            ),
            finalize(() => this.setLoading(false))
          );
        }

        return EMPTY;
      })
    )
  );
  // #endregion
}
