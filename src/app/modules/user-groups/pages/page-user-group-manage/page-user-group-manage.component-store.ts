import { Injectable, inject } from '@angular/core';
import { Observable, switchMap, tap } from 'rxjs';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { UserGroup } from '@modules/user-groups/models/usergroup.model';
import { UserGroupsApiService } from '@modules/user-groups/services/user-groups.api-service';

interface PageUserGroupManageState {
  userGroup?: UserGroup;
}

const PageUserGroupManageInitialState: PageUserGroupManageState = {};

@Injectable()
export class PageUserGroupManageComponentStore extends ComponentStore<PageUserGroupManageState> {
  private _store = inject(Store);
  private _userGroupsApiService = inject(UserGroupsApiService);

  constructor() {
    super(PageUserGroupManageInitialState);
  }

  // #region SELECTORS
  readonly userGroup$ = this.select((state) => state.userGroup);
  // #endRegion

  // #region REDUCERS
  readonly setUserGroup = this.updater((state, userGroup: UserGroup) => ({
    ...state,
    userGroup,
  }));
  // #endRegion

  // #region EFFECTS
  readonly getUserGroup = this.effect((id$: Observable<number>) =>
    id$.pipe(
      switchMap((id) =>
        this._userGroupsApiService.getUserGroup(id).pipe(
          tapResponse(
            (response) => this.setUserGroup(response.data),
            () => undefined
          )
        )
      )
    )
  );
  // #endregion
}
