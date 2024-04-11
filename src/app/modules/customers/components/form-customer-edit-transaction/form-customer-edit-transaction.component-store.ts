import { Injectable, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import cloneDeep from 'lodash-es/cloneDeep';
import { EMPTY, Observable, finalize, switchMap } from 'rxjs';
import { tapResponse } from '@ngrx/component-store';
import { concatLatestFrom } from '@ngrx/effects';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { FormComponentStore } from '@shared/component-stores/form.component-store';
import { FormGroupType } from '@shared/types/form-group.type';
import { CustomerPackageBalance } from '@modules/customers/models/customer-package-balance.model';
import { Transaction } from '@modules/customers/models/transaction.model';
import { CustomersApiService } from '@modules/customers/services/customers.api-service';
import { TransactionsApiService } from '@modules/customers/services/transactions.api-service';

export interface FormCustomerEditTransactionState {
  loading: boolean;
  formGroup?: FormGroup;
  customerPackageBalances?: CustomerPackageBalance[];
}

export const FormCustomerEditTransactionInitialState: FormCustomerEditTransactionState = {
  loading: false,
};

@Injectable()
export class FormCustomerEditTransactionComponentStore extends FormComponentStore<FormCustomerEditTransactionState> {
  private readonly _transaction = inject<Transaction>(NZ_MODAL_DATA);
  private readonly _modalRef = inject(NzModalRef);
  private _messageService = inject(NzMessageService);
  private _customersApiService = inject(CustomersApiService);
  private _transactionsApiService = inject(TransactionsApiService);

  private readonly _formGroupTemplate: FormGroupType = {
    id: new FormControl(null, [Validators.required]),
    amount: new FormControl(null, [Validators.required]),
  };

  constructor() {
    super(FormCustomerEditTransactionInitialState);
    this._createForm();
  }

  // #region SELECTORS
  readonly customerPackageBalances$ = this.select((state) => state.customerPackageBalances);
  // #endregion

  // #region UPDATERS
  private readonly _createForm = this.updater((state): FormCustomerEditTransactionState => {
    const formGroupArray: FormGroup[] = [];
    this._transaction.packages.forEach((customerPackages) => {
      formGroupArray.push(
        new FormGroup({
          id: new FormControl(customerPackages.customerpackage_id, [Validators.required]),
          amount: new FormControl(customerPackages.amount, [Validators.required]),
        })
      );
    });

    const formGroup = new FormGroup({
      created_at: new FormControl(this._transaction.created_at, [Validators.required]),
      remarks: new FormControl(this._transaction.remarks),
      customerpackages: new FormArray(formGroupArray),
    });

    return {
      ...state,
      formGroup,
    };
  });

  readonly addRow = this.updater((state): FormCustomerEditTransactionState => {
    (state.formGroup?.get('customerpackages') as FormArray).push(
      new FormGroup(cloneDeep(this._formGroupTemplate))
    );

    return state;
  });

  readonly deleteRow = this.updater((state, index: number): FormCustomerEditTransactionState => {
    (state.formGroup?.get('customerpackages') as FormArray).removeAt(index);

    return state;
  });

  readonly setCustomerPackageBalances = this.updater(
    (
      state,
      customerPackageBalances: CustomerPackageBalance[]
    ): FormCustomerEditTransactionState => ({
      ...state,
      customerPackageBalances,
    })
  );
  // #endregion

  // #region EFFECTS
  readonly getCustomerPackageBalances = this.effect((void$: Observable<void>) =>
    void$.pipe(
      switchMap(() =>
        this._customersApiService.getPackageBalances(this._transaction.customer_id, {}).pipe(
          tapResponse(
            (response) => this.setCustomerPackageBalances(response.data),
            () => undefined
          )
        )
      )
    )
  );

  readonly submit = this.effect((void$: Observable<void>) =>
    void$.pipe(
      concatLatestFrom(() => this.formGroup$),
      switchMap(([, formGroup]) => {
        this._markAllDirty(formGroup);

        if (formGroup && formGroup.valid) {
          this.setLoading(true);
          const data = formGroup.value;
          data['customer_id'] = this._transaction.customer_id;

          return this._transactionsApiService.updateTransaction(this._transaction.id, data).pipe(
            tapResponse(
              (response) => {
                this._messageService.success(response.message ?? '');
                this._modalRef?.triggerOk();
              },
              () => undefined
            ),
            finalize(() => this.setLoading(false))
          );
        }
        return EMPTY;
      })
    )
  );
  // #endregion
}
