import { Injectable, TemplateRef, inject } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { EMPTY, Observable, forkJoin, of, switchMap, take, tap } from 'rxjs';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Dictionary } from '@ngrx/entity';
import { TranslocoService } from '@ngneat/transloco';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { UtilAggridService } from '@shared/services/util-aggrid.service';
import { UtilModalService } from '@shared/services/util-modal.service';
import { TransactionPackage } from '@modules/customers/models/transaction-package.model';
import { Transaction } from '@modules/customers/models/transaction.model';
import { CustomersApiService } from '@modules/customers/services/customers.api-service';
import { TransactionsApiService } from '@modules/customers/services/transactions.api-service';
import { Package } from '@modules/packages/models/package.model';
import { FormCustomerEditTransactionComponent } from '../form-customer-edit-transaction/form-customer-edit-transaction.component';

interface TableCustomerTransactionsState {
  customerId?: number;
  customerPackageId?: number;
  actionCell?: TemplateRef<any>;
}

const TableCustomerTransactionsInitialState: TableCustomerTransactionsState = {};

@Injectable()
export class TableCustomerTransactionsComponentStore extends ComponentStore<TableCustomerTransactionsState> {
  private _messageService = inject(NzMessageService);
  private _modalService = inject(NzModalService);
  private _translocoService = inject(TranslocoService);
  private _utilModalService = inject(UtilModalService);
  private _utilAggridService = inject(UtilAggridService);
  private _transactionsApiService = inject(TransactionsApiService);
  private _customersApiService = inject(CustomersApiService);

  constructor() {
    super(TableCustomerTransactionsInitialState);
  }

  // #region SELECTORS
  private readonly _customerId$ = this.select((state) => state.customerId);

  private readonly _customerPackageId$ = this.select((state) => state.customerPackageId);

  readonly dataSource$ = of((qParams: Dictionary<any>) =>
    this.select(this._customerId$, this._customerPackageId$, (customerId, customerPackageId) => [
      customerId,
      customerPackageId,
    ]).pipe(
      switchMap(([customerId, customerPackageId]) => {
        const params = qParams;
        if (customerPackageId) params['customerPackage_id'] = customerPackageId;

        return customerId ? this._customersApiService.getTransactions(customerId, params) : EMPTY;
      })
    )
  );

  readonly columnDefs$ = this.select(
    this._customerPackageId$,
    this.select((state) => state.actionCell),
    (customerPackageId, actionCell) => {
      const packageNameFn = (params: any) => {
        return params.data?.packages.map((p: TransactionPackage) => p.name).join(', ');
      };

      const amountFn = (params: any) => {
        console.log;
        return (params.data?.packages as TransactionPackage[] | undefined)
          ?.map((p: TransactionPackage) => p.amount)
          .reduce((a, b) => a + b, 0);
      };

      const colDefs: ColDef[] = [
        this._utilAggridService.getIndexColDef(),
        this._utilAggridService.getDateColDef('Date', 'created_at', 100),
        this._utilAggridService.getColDef('Package(s)', '', false, false, undefined, packageNameFn),
        this._utilAggridService.getColDef('Remarks', 'remarks', false),
        this._utilAggridService.getNumberColDef('Amount (RM)', '', false, amountFn),
      ];

      // hide action cell when customer package id is provided
      if (actionCell && !customerPackageId) {
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

  readonly setCustomerPackageId = this.updater((state, customerPackageId: number) => ({
    ...state,
    customerPackageId,
  }));

  readonly setActionCell = this.updater((state, actionCell: TemplateRef<any>) => ({
    ...state,
    actionCell,
  }));
  // #endRegion

  // #region EFFECTS
  readonly editCustomerTransactionModal = this.effect(
    (
      data$: Observable<{
        transaction: Transaction;
        onOk: () => void;
      }>
    ) =>
      data$.pipe(
        switchMap(({ transaction, onOk }) =>
          forkJoin([
            of(transaction),
            this._translocoService
              .selectTranslate<string>('customer-module.edit-transaction')
              .pipe(take(1)),
            of(onOk),
          ])
        ),
        tap(([transaction, nzTitle, onOk]) => {
          this._modalService.create({
            nzTitle,
            nzWidth: 1024,
            nzContent: FormCustomerEditTransactionComponent,
            nzOnOk: onOk,
            nzData: transaction,
          });
        })
      )
  );

  readonly deleteCustomerTransaction = this.effect(
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
            this._translocoService.selectTranslate('customer-module.delete-transaction'),
            this._translocoService.selectTranslate('customer-module.delete-transaction-message'),
            data
          )
        ),
        switchMap(({ id, onComplete }) =>
          this._transactionsApiService.deleteTransaction(id).pipe(
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
