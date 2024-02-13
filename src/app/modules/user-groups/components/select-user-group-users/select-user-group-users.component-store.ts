import { Injectable, TemplateRef, inject } from '@angular/core';
import {
  EMPTY,
  Observable,
  debounceTime,
  distinctUntilChanged,
  filter,
  finalize,
  map,
  of,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { concatLatestFrom } from '@ngrx/effects';
import { Dictionary } from '@ngrx/entity';
import { Store } from '@ngrx/store';
import { TranslocoService } from '@ngneat/transloco';
import { NzMessageService } from 'ng-zorro-antd/message';
import { User } from '@core/models/user.model';
import { selectHasPermissions } from '@core/states/auth/auth.selectors';
import { UtilAggridService } from '@shared/services/util-aggrid.service';
import { UtilModalService } from '@shared/services/util-modal.service';
import { UserGroup } from '@modules/user-groups/models/usergroup.model';
import { UserGroupsApiService } from '@modules/user-groups/services/user-groups.api-service';

interface SelectUserGroupUsersState {
  searching: boolean;
  loading: boolean;
  userGroupId?: number;
  users?: User[]; // searched users
}

const SelectUserGroupUsersInitialState: SelectUserGroupUsersState = {
  searching: false,
  loading: false,
};

@Injectable()
export class SelectUserGroupUsersComponentStore extends ComponentStore<SelectUserGroupUsersState> {
  private _store = inject(Store);
  private _userGroupsApiService = inject(UserGroupsApiService);

  constructor() {
    super(SelectUserGroupUsersInitialState);
  }

  // #region SELECTORS
  readonly searching$ = this.select((state) => state.searching);

  readonly loading$ = this.select((state) => state.loading);

  readonly userGroupId$ = this.select((state) => state.userGroupId);

  readonly users$ = this.select((state) => state.users);

  readonly disabled$ = this._store
    .select(selectHasPermissions(['usergroups.update']))
    .pipe(map((x) => !x));
  // #endRegion

  // #region REDUCERS
  readonly setSearching = this.updater((state, searching: boolean) => ({
    ...state,
    searching,
  }));

  readonly setLoading = this.updater((state, loading: boolean) => ({
    ...state,
    loading,
  }));

  readonly setUserGroupId = this.updater((state, userGroupId: number) => ({
    ...state,
    userGroupId,
  }));

  readonly setUsers = this.updater((state, users: User[]) => ({
    ...state,
    users,
  }));
  // #endRegion

  // #region EFFECTS
  readonly searchUsers = this.effect((searchStr$: Observable<string>) =>
    searchStr$.pipe(
      debounceTime(300),
      concatLatestFrom(() => this.userGroupId$),
      tap(() => this.setSearching(true)),
      switchMap(([searchStr, userGroupId]) =>
        this._userGroupsApiService
          .getNotUsers(userGroupId!, {
            email: `contains:${searchStr}`,
          })
          .pipe(
            tapResponse(
              (response) => this.setUsers(response.data.data),
              () => undefined
            ),
            finalize(() => this.setSearching(false))
          )
      )
    )
  );
  // #endregion
}
