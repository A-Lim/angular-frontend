import { Injectable, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EMPTY, Observable, switchMap } from 'rxjs';
import { concatLatestFrom } from '@ngrx/effects';
import { NzMessageService } from 'ng-zorro-antd/message';
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
        name: new FormControl(null, [Validators.required]),
        email: new FormControl(null, [Validators.email]),
        phone: new FormControl(null),
        remarks: new FormControl(null),
      }),
    })
  );

  readonly patchForm = this.updater((state, customer: Customer): FormEditCustomerState => {
    state.formGroup?.patchValue(customer);
    return state;
  });
  // #endregion

  // #region EFFECTS
  readonly submit = this.effect((customerId$: Observable<number>) =>
    customerId$.pipe(
      concatLatestFrom(() => this.formGroup$),
      switchMap(([, formGroup]) => {
        this._markAllDirty(formGroup);

        if (formGroup && formGroup.valid) {
          this.setLoading(true);

          // return this._customersApiService.updateCustomer(this._customer.id, formGroup.value).pipe(
          //   tapResponse(
          //     (response) => {
          //       this._messageSvc.success(response.message ?? '');
          //       this._modalRef?.triggerOk();
          //     },
          //     () => undefined
          //   ),
          //   finalize(() => this.setLoading(false))
          // );
        }
        return EMPTY;
      })
    )
  );
  // #endregion
}
