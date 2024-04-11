import { Injectable, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EMPTY, Observable, finalize, of, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/component-store';
import { concatLatestFrom } from '@ngrx/effects';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { FormComponentStore } from '@shared/component-stores/form.component-store';
import { CustomerPackage } from '@modules/customers/models/customer-package.model';
import { CustomersApiService } from '@modules/customers/services/customers.api-service';

export interface FormCustomerEditPackageState {
  loading: boolean;
  formGroup?: FormGroup;
}

export const FormCustomerEditPackageInitialState: FormCustomerEditPackageState = {
  loading: false,
};

@Injectable()
export class FormCustomerEditPackageComponentStore extends FormComponentStore<FormCustomerEditPackageState> {
  private _modalRef = inject(NzModalRef);
  private _customersApiService = inject(CustomersApiService);
  private _messageService = inject(NzMessageService);

  constructor() {
    super(FormCustomerEditPackageInitialState);
  }

  // #region SELECTORS
  // #endregion

  // #region UPDATERS
  readonly createForm = this.updater(
    (state, customerPackage: CustomerPackage): FormCustomerEditPackageState => ({
      ...state,
      formGroup: new FormGroup({
        count: new FormControl(customerPackage.count, [Validators.required]),
        price: new FormControl(customerPackage.price, [Validators.required]),
        remarks: new FormControl(customerPackage.remarks),
      }),
    })
  );
  // #endregion

  // #region EFFECTS
  readonly submit = this.effect((id$: Observable<number>) =>
    id$.pipe(
      concatLatestFrom(() => this.formGroup$),
      switchMap(([id, formGroup]) => {
        this._markAllDirty(formGroup);

        if (formGroup && formGroup.valid) {
          this.setLoading(true);

          console.log(formGroup.value);

          return this._customersApiService.updateCustomerPackage(id, formGroup.value).pipe(
            tapResponse(
              (response) => {
                this._messageService.success(response.message ?? '');
                this._modalRef.triggerOk();
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
