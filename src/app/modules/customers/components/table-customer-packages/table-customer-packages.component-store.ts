import { Injectable, TemplateRef, inject } from '@angular/core';
import { EMPTY, Observable, forkJoin, of, switchMap, take, tap } from 'rxjs';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Dictionary } from '@ngrx/entity';
import { TranslocoService } from '@ngneat/transloco';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { UtilAggridService } from '@shared/services/util-aggrid.service';
import { UtilModalService } from '@shared/services/util-modal.service';
import { Customer } from '@modules/customers/models/customer.model';
import { CustomersApiService } from '@modules/customers/services/customers.api-service';
import { FormEditCustomerComponent } from '../form-edit-customer/form-edit-customer.component';

interface TableCustomerPackagesState {
  customerId?: number;
  actionCell?: TemplateRef<any>;
}

const TableCustomerPackagesInitialState: TableCustomerPackagesState = {};

@Injectable()
export class TableCustomerPackagesComponentStore extends ComponentStore<TableCustomerPackagesState> {
  private _messageService = inject(NzMessageService);
  private _modalService = inject(NzModalService);
  private _utilModalService = inject(UtilModalService);
  private _customersApiService = inject(CustomersApiService);
  private _utilAggridService = inject(UtilAggridService);
  private _translocoService = inject(TranslocoService);

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
    this.select((state) => state.actionCell),
    (actionCell) => {
      const colDefs = [
        this._utilAggridService.getIndexColDef(),
        this._utilAggridService.getColDef('Package', 'name', true, true),
        this._utilAggridService.getDateColDef('Date', 'purchased_date', 100),
        this._utilAggridService.getColDef('Remarks', 'remarks', false, false),
        this._utilAggridService.getNumberColDef('Count', 'count', false),
        this._utilAggridService.getNumberColDef('Price (RM)', 'price', false),
      ];

      if (actionCell) {
        colDefs.push(this._utilAggridService.getActionColDef('Action', '', 90, actionCell));
      }

      return colDefs;
    }
  );
  // #endRegion

  // #region REDUCERS
  readonly setCustomerId = this.updater((state, customerId: number) => ({
    ...state,
    customerId,
  }));

  readonly setActionCell = this.updater((state, actionCell: TemplateRef<any>) => ({
    ...state,
    actionCell,
  }));
  // #endRegion

  // #region EFFECTS
  readonly editCustomerModal = this.effect(
    (
      data$: Observable<{
        customer: Customer;
        onOk: () => void;
      }>
    ) =>
      data$.pipe(
        switchMap(({ customer, onOk }) =>
          forkJoin([
            of(customer),
            this._translocoService.selectTranslate<string>('customer-module.edit').pipe(take(1)),
            of(onOk),
          ])
        ),
        tap(([customer, nzTitle, onOk]) => {
          this._modalService.create({
            nzTitle,
            nzWidth: 1024,
            nzContent: FormEditCustomerComponent,
            nzOnOk: onOk,
            nzData: customer,
          });
        })
      )
  );

  readonly deleteCustomer = this.effect(
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
            this._translocoService.selectTranslate('customer-module.delete'),
            this._translocoService.selectTranslate('customer-module.delete-message'),
            data
          )
        ),
        switchMap(({ id, onComplete }) =>
          this._customersApiService.deleteCustomer(id).pipe(
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
