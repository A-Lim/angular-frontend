import { Injectable, TemplateRef, inject } from '@angular/core';
import {
  EMPTY,
  Observable,
  debounceTime,
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
import { TranslocoService } from '@ngneat/transloco';
import { NzMessageService } from 'ng-zorro-antd/message';
import { User } from '@core/models/user.model';
import { UtilAggridService } from '@shared/services/util-aggrid.service';
import { UtilModalService } from '@shared/services/util-modal.service';
import { UserGroup } from '@modules/user-groups/models/usergroup.model';
import { UserGroupsApiService } from '@modules/user-groups/services/user-groups.api-service';

interface TableUserGroupUsersState {
  searching: boolean;
  users?: User[]; // searched users
  userGroup?: UserGroup | undefined | null;
  actionCell?: TemplateRef<any>;
  statusCell?: TemplateRef<any>;
}

const TableUserGroupUsersInitialState: TableUserGroupUsersState = {
  searching: false,
};

@Injectable()
export class TableUserGroupUsersComponentStore extends ComponentStore<TableUserGroupUsersState> {
  private _utilAggridService = inject(UtilAggridService);
  private _utilModalService = inject(UtilModalService);
  private _messageService = inject(NzMessageService);
  private _userGroupsApiService = inject(UserGroupsApiService);
  private _translocoService = inject(TranslocoService);

  constructor() {
    super(TableUserGroupUsersInitialState);
  }

  // #region SELECTORS
  readonly searching$ = this.select((state) => state.searching);

  readonly users$ = this.select((state) => state.users);

  readonly userGroup$ = this.select((state) => state.userGroup);

  readonly userGroupId$ = this.select(this.userGroup$, (userGroup) => userGroup?.id);

  readonly dataSource$ = of((qParams: Dictionary<any>) =>
    this.select((state) => state.userGroup?.id).pipe(
      switchMap((userGroupId) =>
        userGroupId ? this._userGroupsApiService.getUsers(userGroupId!, qParams) : EMPTY
      )
    )
  );

  readonly columnDefs$ = this.select(
    this.select((state) => state.statusCell),
    this.select((state) => state.actionCell),
    (statusCell, actionCell) => {
      const colDefs = [
        this._utilAggridService.getIndexColDef(),
        this._utilAggridService.getColDef('Name', 'name', true, true),
        this._utilAggridService.getColDef('Email', 'email', true, true),
        this._utilAggridService.getColDef('Phone', 'phone', true, true),
        this._utilAggridService.getDateColDef('Date Of Birth', 'date_of_birth'),
      ];

      if (statusCell) {
        colDefs.push(
          this._utilAggridService.getStatusColDef('Status', 'status', 100, false, statusCell)
        );
      }

      if (actionCell) {
        colDefs.push(this._utilAggridService.getActionColDef('Action', '', 90, actionCell));
      }

      return colDefs;
    }
  );
  // #endRegion

  // #region REDUCERS
  readonly setUserGroup = this.updater((state, userGroup: UserGroup | null | undefined) => ({
    ...state,
    userGroup,
  }));

  readonly setSearching = this.updater((state, searching: boolean) => ({
    ...state,
    searching,
  }));

  readonly setUsers = this.updater((state, users: User[]) => ({
    ...state,
    users,
  }));

  readonly setStatusCell = this.updater((state, statusCell: TemplateRef<any>) => ({
    ...state,
    statusCell,
  }));

  readonly setActionCell = this.updater((state, actionCell: TemplateRef<any>) => ({
    ...state,
    actionCell,
  }));
  // #endRegion

  // #region EFFECTS
  readonly searchUser = this.effect((searchStr$: Observable<string>) =>
    searchStr$.pipe(
      debounceTime(600),
      tap(() => this.setSearching(true)),
      withLatestFrom(this.userGroup$),
      switchMap(([searchStr, userGroup]) =>
        this._userGroupsApiService
          .getNotUsers(userGroup!.id, {
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

  readonly addUsers = this.effect(
    (
      data$: Observable<{
        userIds: number[];
        onStart: () => void;
        onComplete: () => void;
      }>
    ) =>
      data$.pipe(
        concatLatestFrom(() => this.userGroup$),
        filter(([{ userIds }]) => userIds.length > 0),
        tap(([{ onStart }]) => onStart()),
        switchMap(([{ userIds, onComplete }, userGroup]) =>
          this._userGroupsApiService.addUsers(userGroup!.id, userIds).pipe(
            tapResponse(
              (response) => {
                if (response.message) {
                  this._messageService.success(response.message);
                }

                onComplete();
              },
              () => undefined
            )
          )
        )
      )
  );

  readonly removeUser = this.effect((data$: Observable<{ id: number; onComplete: () => void }>) =>
    data$.pipe(
      switchMap((data) =>
        this._utilModalService.confirm$<{
          id: number;
          onComplete: () => void;
        }>(
          this._translocoService.selectTranslate('usergroup-module.remove-user'),
          this._translocoService.selectTranslate('usergroup-module.remove-user-message'),
          data
        )
      ),
      concatLatestFrom(() => [this.userGroup$]),
      switchMap(([{ id, onComplete }, userGroup]) =>
        this._userGroupsApiService.removeUser(userGroup!.id, id).pipe(
          tapResponse(
            (response) => {
              if (response.message) {
                this._messageService.success(response.message);
              }

              onComplete();
            },
            () => undefined
          )
        )
      )
    )
  );
  // #endregion
}
