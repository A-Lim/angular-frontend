import { Injectable, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import cloneDeep from 'lodash-es/cloneDeep';
import { EMPTY, Observable, finalize, switchMap } from 'rxjs';
import { tapResponse } from '@ngrx/component-store';
import { concatLatestFrom } from '@ngrx/effects';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { FormComponentStore } from '@shared/component-stores/form.component-store';
import { FormGroupType } from '@shared/types/form-group.type';
import { CustomersApiService } from '@modules/customers/services/customers.api-service';

export interface FormCreateCustomersState {
  loading: boolean;
  formGroup?: FormGroup;
}

export const FormCreateCustomersInitialState: FormCreateCustomersState = {
  loading: false,
};

@Injectable()
export class FormCreateCustomersComponentStore extends FormComponentStore<FormCreateCustomersState> {
  private _customersApiService = inject(CustomersApiService);
  private _messageSvc = inject(NzMessageService);
  private _modalRef = inject(NzModalRef, { optional: true });
  private readonly _formGroupTemplate: FormGroupType = {
    name: new FormControl(null, [Validators.required]),
    email: new FormControl(null, [Validators.email]),
    phone: new FormControl(null),
    remarks: new FormControl(null),
  };

  constructor() {
    super(FormCreateCustomersInitialState);
    this._createForm();
  }

  // #region SELECTORS
  // #endregion

  // #region UPDATERS
  private readonly _createForm = this.updater(
    (state): FormCreateCustomersState => ({
      ...state,
      formGroup: new FormGroup({
        customers: new FormArray([new FormGroup(cloneDeep(this._formGroupTemplate))]),
      }),
    })
  );

  readonly addRow = this.updater((state): FormCreateCustomersState => {
    (state.formGroup?.get('customers') as FormArray).push(
      new FormGroup(cloneDeep(this._formGroupTemplate))
    );

    return state;
  });

  readonly deleteRow = this.updater((state, index: number): FormCreateCustomersState => {
    (state.formGroup?.get('customers') as FormArray).removeAt(index);

    return state;
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

          return this._customersApiService.bulkCreateCustomers(formGroup.value.customers).pipe(
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
