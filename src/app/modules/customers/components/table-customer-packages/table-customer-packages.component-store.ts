import { Injectable, TemplateRef, inject } from '@angular/core';
import { EMPTY, Observable, forkJoin, of, switchMap, tap } from 'rxjs';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Dictionary } from '@ngrx/entity';
import { TranslocoService } from '@ngneat/transloco';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { UtilAggridService } from '@shared/services/util-aggrid.service';
import { UtilModalService } from '@shared/services/util-modal.service';
import { UtilTranslocoService } from '@shared/services/util-transloco.service';
import { CustomerPackage } from '@modules/customers/models/customer-package.model';
import { CustomersApiService } from '@modules/customers/services/customers.api-service';
import { CustomerPackageInfoComponent } from '../customer-package-info/customer-package-info.component';

interface TableCustomerPackagesState {
  customerId?: number;
  statusCell?: TemplateRef<any>;
  actionCell?: TemplateRef<any>;
}

const TableCustomerPackagesInitialState: TableCustomerPackagesState = {};

@Injectable()
export class TableCustomerPackagesComponentStore extends ComponentStore<TableCustomerPackagesState> {
  private _messageService = inject(NzMessageService);
  private _modalService = inject(NzModalService);
  private _customersApiService = inject(CustomersApiService);
  private _translocoService = inject(TranslocoService);
  private _utilAggridService = inject(UtilAggridService);
  private _utilModalService = inject(UtilModalService);

  constructor() {
    super(TableCustomerPackagesInitialState);
  }

  // #region SELECTORS
  readonly dataSource$ = of((qParams: Dictionary<any>) =>
    this.select((state) => state.customerId).pipe(
      switchMap((customerId) =>
        customerId ? this._customersApiService.getPackages(customerId, qParams) : EMPTY
      )
    )
  );

  readonly columnDefs$ = this.select(
    this.select((state) => state.statusCell),
    this.select((state) => state.actionCell),
    (statusCell, actionCell) => {
      const colDefs = [
        this._utilAggridService.getIndexColDef(),
        this._utilAggridService.getColDef('Package', 'name', true, true),
        this._utilAggridService.getDateColDef('Date', 'purchased_at', 100),
        this._utilAggridService.getNumberColDef('Count', 'count', false),
        this._utilAggridService.getNumberColDef('Price (RM)', 'price', false),
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
  // #endregion

  // #region UPDATERS
  readonly setCustomerId = this.updater((state, customerId: number) => ({
    ...state,
    customerId,
  }));

  readonly setStatusCell = this.updater((state, statusCell: TemplateRef<any>) => ({
    ...state,
    statusCell,
  }));

  readonly setActionCell = this.updater((state, actionCell: TemplateRef<any>) => ({
    ...state,
    actionCell,
  }));
  // #endregion

  // #region EFFECTS
  readonly editCustomerPackageModal = this.effect(
    (
      data$: Observable<{
        customerPackage: CustomerPackage;
        onOk: () => void;
      }>
    ) =>
      data$.pipe(
        switchMap(({ customerPackage, onOk }) => forkJoin([of(customerPackage), of(onOk)])),
        tap(([customerPackage, onOk]) => {
          this._modalService.create({
            nzWidth: 1024,
            nzContent: CustomerPackageInfoComponent,
            nzOnOk: onOk,
            nzData: customerPackage,
          });
        })
      )
  );

  readonly deleteCustomerPackage = this.effect(
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
            this._translocoService.selectTranslate('customer-module.delete-package'),
            this._translocoService.selectTranslate('customer-module.delete-package-message'),
            data
          )
        ),
        switchMap(({ id, onComplete }) =>
          this._customersApiService.deleteCustomerPackage(id).pipe(
            tapResponse(
              (response) => {
                if (response.message) {
                  this._messageService.success(response.message);
                  onComplete();
                }
              },
              () => undefined
            )
          )
        )
      )
  );
  // #endregion
}
