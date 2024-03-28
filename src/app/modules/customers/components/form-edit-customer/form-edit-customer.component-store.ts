import { Injectable, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EMPTY, Observable, finalize, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/component-store';
import { concatLatestFrom } from '@ngrx/effects';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { FormComponentStore } from '@shared/component-stores/form.component-store';
import { CustomersApiService } from '@modules/customers/customers.api-service';
import { Customer } from '@modules/customers/models/customer.model';

export interface FormEditCustomerState {
  loading: boolean;
  formGroup?: FormGroup;
}

export const FormEditCustomerInitialState: FormEditCustomerState = {
  loading: false,
};

@Injectable()
export class FormEditCustomerComponentStore extends FormComponentStore<FormEditCustomerState> {
  private _customer: Customer = inject(NZ_MODAL_DATA);
  private _customersApiService = inject(CustomersApiService);
  private _messageSvc = inject(NzMessageService);
  private _modalRef = inject(NzModalRef, { optional: true });

  constructor() {
    super(FormEditCustomerInitialState);
  }

  // #region SELECTORS
  // #endregion

  // #region UPDATERS
  readonly createForm = this.updater((state): FormEditCustomerState => {
    const formGroup = new FormGroup({
      name: new FormControl(this._customer.name, [Validators.required]),
      email: new FormControl(this._customer.email, [Validators.email]),
      phone: new FormControl(this._customer.phone),
      remarks: new FormControl(this._customer.remarks),
    });
    return {
      ...state,
      formGroup,
    };
  });
  // #endregion

  // #region EFFECTS
  readonly submit = this.effect((void$: Observable<void>) =>
    void$.pipe(
      concatLatestFrom(() => this.formGroup$),
      switchMap(([, formGroup]) => {
        this._markAllDirty(formGroup);

        if (formGroup && formGroup.valid) {
          this.setLoading(true);

          return this._customersApiService.updateCustomer(this._customer.id, formGroup.value).pipe(
            tapResponse(
              (response) => {
                this._messageSvc.success(response.message ?? '');
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
