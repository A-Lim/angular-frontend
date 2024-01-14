import { Injectable, TemplateRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import { filter, map, of } from 'rxjs';
import { ComponentStore } from '@ngrx/component-store';
import { UtilAggridService } from '@shared/services/util-aggrid.service';
import { UsersApiService } from '@modules/users/services/users.api-service';

interface TableUsersState {
  phoneCell?: TemplateRef<any>;
  actionCell?: TemplateRef<any>;
  statusCell?: TemplateRef<any>;
}

const TableUsersInitialState: TableUsersState = {};

@Injectable()
export class TableUsersComponentStore extends ComponentStore<TableUsersState> {
  private _router = inject(Router);
  private _usersApiService = inject(UsersApiService);
  private _utilAggridService = inject(UtilAggridService);

  constructor() {
    super(TableUsersInitialState);
  }

  // #region SELECTORS

  readonly dataSourceCallback$ = of((qParams: any) =>
    this._usersApiService.getUsers(qParams)
  );

  readonly columnDef$ = this.select((state) => state).pipe(
    filter(
      (state) => state.statusCell != undefined && state.actionCell != undefined
    ),
    map((state) => {
      const colDefs = [
        this._utilAggridService.getIndexColDef(),
        this._utilAggridService.getColDef('Name', 'name', true, true),
        this._utilAggridService.getColDef('Email', 'email', true, true),
        // this._utilAggridService.getColDef('Phone', 'phone', true, true),
        this._utilAggridService.getDateColDef('Date Of Birth', 'date_of_birth'),
      ];

      if (state.phoneCell) {
        colDefs.push(
          this._utilAggridService.getTemplateColDef(
            'Phone',
            'phone',
            140,
            true,
            true,
            false,
            state.phoneCell
          )
        );
      }

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
  readonly setPhoneCell = this.updater(
    (state, phoneCell: TemplateRef<any>) => ({
      ...state,
      phoneCell,
    })
  );

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
