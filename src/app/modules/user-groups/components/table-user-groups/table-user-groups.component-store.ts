import { Injectable, TemplateRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import { filter, map, of } from 'rxjs';
import { ComponentStore } from '@ngrx/component-store';
import { UtilAggridService } from '@shared/services/util-aggrid.service';
import { UserGroupsApiService } from '@modules/user-groups/services/user-groups.api-service';

interface TableUserGroupsState {
  actionCell?: TemplateRef<any>;
  statusCell?: TemplateRef<any>;
}

const TableUserGroupsInitialState: TableUserGroupsState = {};

@Injectable()
export class TableUserGroupsComponentStore extends ComponentStore<TableUserGroupsState> {
  private _router = inject(Router);
  private _userGroupsApiService = inject(UserGroupsApiService);
  private _utilAggridService = inject(UtilAggridService);

  constructor() {
    super(TableUserGroupsInitialState);
  }

  // #region SELECTORS

  readonly dataSourceCallback$ = of((qParams: any) =>
    this._userGroupsApiService.getUserGroups(qParams)
  );

  readonly columnDef$ = this.select((state) => state).pipe(
    filter(
      (state) => state.statusCell != undefined && state.actionCell != undefined
    ),
    map((state) => {
      const colDefs = [
        this._utilAggridService.getIndexColDef(),
        this._utilAggridService.getColDef('Name', 'name', true, true),
        this._utilAggridService.getColDef('Code', 'code', true, true),
        this._utilAggridService.getNumberColDef('No of users', 'users_count'),
      ];

      if (state.statusCell) {
        colDefs.push(
          this._utilAggridService.getStatusColDef(
            'Status',
            'status',
            100,
            false,
            state.statusCell
          )
        );
      }

      if (state.actionCell) {
        colDefs.push(
          this._utilAggridService.getActionColDef(
            'Action',
            '',
            90,
            state.actionCell
          )
        );
      }

      return colDefs;
    })
  );
  // #endRegion

  // #region REDUCERS
  readonly setStatusCell = this.updater(
    (state, statusCell: TemplateRef<any>) => ({
      ...state,
      statusCell,
    })
  );

  readonly setActionCell = this.updater(
    (state, actionCell: TemplateRef<any>) => ({
      ...state,
      actionCell,
    })
  );
  // #endRegion

  // #region EFFECTS
  // #endregion

  // #region FUNCTIONS
  navigateTo(path: string) {
    this._router.navigate([path]);
  }
  // #endregion
}
