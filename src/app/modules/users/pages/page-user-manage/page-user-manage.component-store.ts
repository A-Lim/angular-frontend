import { Injectable, inject } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { User } from '@core/models/user.model';
import { UsersApiService } from '@modules/users/services/users.api-service';

interface PageUserManageState {
  user?: User;
}

const PageUserManageInitialState: PageUserManageState = {};

@Injectable()
export class PageUserManageComponentStore extends ComponentStore<PageUserManageState> {
  private _usersApiService = inject(UsersApiService);

  constructor() {
    super(PageUserManageInitialState);
  }

  // #region SELECTORS
  readonly user$ = this.select((state) => state.user);
  // #endRegion

  // #region REDUCERS
  readonly setUser = this.updater((state, user: User) => ({
    ...state,
    user,
  }));
  // #endRegion

  // #region EFFECTS
  readonly getUser = this.effect((id$: Observable<number>) =>
    id$.pipe(
      switchMap((id) =>
        this._usersApiService.getUser(id).pipe(
          tapResponse(
            (response) => this.setUser(response.data),
            () => undefined
          )
        )
      )
    )
  );
  // #endregion
}
