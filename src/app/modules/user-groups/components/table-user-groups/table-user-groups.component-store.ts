import { Injectable, TemplateRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, filter, map, of, switchMap } from 'rxjs';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { TranslocoService } from '@ngneat/transloco';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UtilAggridService } from '@shared/services/util-aggrid.service';
import { UtilModalService } from '@shared/services/util-modal.service';
import { UserGroupsApiService } from '@modules/user-groups/services/user-groups.api-service';

interface TableUserGroupsState {
  actionCell?: TemplateRef<any>;
  statusCell?: TemplateRef<any>;
}

const TableUserGroupsInitialState: TableUserGroupsState = {};

@Injectable()
export class TableUserGroupsComponentStore extends ComponentStore<TableUserGroupsState> {
  private _messageService = inject(NzMessageService);
  private _utilModalService = inject(UtilModalService);
  private _userGroupsApiService = inject(UserGroupsApiService);
  private _utilAggridService = inject(UtilAggridService);
  private _translocoService = inject(TranslocoService);

  constructor() {
    super(TableUserGroupsInitialState);
  }

  // #region SELECTORS

  readonly dataSource$ = of((qParams: any) => this._userGroupsApiService.getUserGroups(qParams));

  readonly columnDefs$ = this.select(
    this.select((state) => state.actionCell),
    this.select((state) => state.statusCell),
    (actionCell, statusCell) => {
      const colDefs = [
        this._utilAggridService.getIndexColDef(),
        this._utilAggridService.getColDef('Name', 'name', true, true),
        this._utilAggridService.getColDef('Code', 'code', true, true),
        this._utilAggridService.getNumberColDef('No of users', 'users_count'),
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
  readonly deleteUserGroup = this.effect(
    (
      data$: Observable<{
        id: number;
        onComplete: () => void;
      }>
    ) =>
      data$.pipe(
        switchMap((data) =>
          this._utilModalService.confirm$<{
            id: number;
            onComplete: () => void;
          }>(
            this._translocoService.selectTranslate('usergroup-module.delete'),
            this._translocoService.selectTranslate('usergroup-module.delete-message'),
            data
          )
        ),
        switchMap(({ id, onComplete }) =>
          this._userGroupsApiService.deleteUserGroup(id).pipe(
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
