import { Injectable, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EMPTY, Observable, finalize, switchMap } from 'rxjs';
import { tapResponse } from '@ngrx/component-store';
import { concatLatestFrom } from '@ngrx/effects';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { FormComponentStore } from '@shared/component-stores/form.component-store';
import { Customer } from '@modules/customers/models/customer.model';
import { CustomersApiService } from '@modules/customers/services/customers.api-service';

export interface FormEditCustomerState {
  loading: boolean;
  formGroup?: FormGroup;
}

export const FormEditCustomerInitialState: FormEditCustomerState = {
  loading: false,
};

@Injectable()
export class FormEditCustomerComponentStore extends FormComponentStore<FormEditCustomerState> {
  private readonly _customer = inject(NZ_MODAL_DATA);
  private readonly _modalRef = inject(NzModalRef);
  private _customersApiService = inject(CustomersApiService);
  private _messageSvc = inject(NzMessageService);

  constructor() {
    super(FormEditCustomerInitialState);
    this._createForm();
  }

  // #region SELECTORS
  // #endregion

  // #region UPDATERS
  private readonly _createForm = this.updater(
    (state): FormEditCustomerState => ({
      ...state,
      formGroup: new FormGroup({
        name: new FormControl(this._customer.name, [Validators.required]),
        email: new FormControl(this._customer.email, [Validators.email]),
        phone: new FormControl(this._customer.phone),
        remarks: new FormControl(this._customer.remarks),
      }),
    })
  );
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
                this._modalRef.close(response.data);
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
