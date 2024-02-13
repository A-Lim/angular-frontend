import { Injectable, TemplateRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import { filter, map, of } from 'rxjs';
import { ComponentStore } from '@ngrx/component-store';
import { Dictionary } from '@ngrx/entity';
import { UtilAggridService } from '@shared/services/util-aggrid.service';
import { UsersApiService } from '@modules/users/services/users.api-service';

interface TableUsersState {
  actionCell?: TemplateRef<any>;
  statusCell?: TemplateRef<any>;
}

const TableUsersInitialState: TableUsersState = {};

@Injectable()
export class TableUsersComponentStore extends ComponentStore<TableUsersState> {
  private _usersApiService = inject(UsersApiService);
  private _utilAggridService = inject(UtilAggridService);

  constructor() {
    super(TableUsersInitialState);
  }

  // #region SELECTORS

  readonly dataSource$ = of((qParams: Dictionary<any>) => this._usersApiService.getUsers(qParams));

  readonly columnDefs$ = this.select(
    this.select((state) => state.statusCell),
    this.select((state) => state.actionCell),
    (statusCell, actionCell) => {
      const colDefs = [
        this._utilAggridService.getIndexColDef(),
        this._utilAggridService.getColDef('Name', 'name', true, true),
        this._utilAggridService.getLinkColDef('Email', 'email', 'mailto', true, true),
        this._utilAggridService.getLinkColDef('Phone', 'phone', 'tel', true, true),
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
  // #endregion
}
