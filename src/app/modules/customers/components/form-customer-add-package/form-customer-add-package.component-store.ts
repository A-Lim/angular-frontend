import { Injectable, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import cloneDeep from 'lodash-es/cloneDeep';
import { EMPTY, Observable, finalize, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/component-store';
import { concatLatestFrom } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { SessionActions } from '@core/states/session/session.actions';
import { selectSession } from '@core/states/session/session.selectors';
import { FormComponentStore } from '@shared/component-stores/form.component-store';
import { FormGroupType } from '@shared/types/form-group.type';
import { CustomersApiService } from '@modules/customers/services/customers.api-service';
import { Package } from '@modules/packages/models/package.model';

export interface FormCustomerAddPackageState {
  loading: boolean;
  formGroup?: FormGroup;
}

export const FormCustomerAddPackageInitialState: FormCustomerAddPackageState = {
  loading: false,
};

@Injectable()
export class FormCustomerAddPackageComponentStore extends FormComponentStore<FormCustomerAddPackageState> {
  private _store = inject(Store);
  private _customersApiService = inject(CustomersApiService);
  private _messageService = inject(NzMessageService);
  private readonly _customer = inject(NZ_MODAL_DATA);
  private readonly _modalRef = inject(NzModalRef, { optional: true });
  private readonly _formGroupTemplate: FormGroupType = {
    package_id: new FormControl(null, [Validators.required]),
    price: new FormControl(null, [Validators.required]),
    count: new FormControl(null, [Validators.required]),
    amount_paid: new FormControl(null),
    remarks: new FormControl(null),
  };

  constructor() {
    super(FormCustomerAddPackageInitialState);
    this._createForm();
  }

  // #region SELECTORS
  readonly packages$ = this._store.select(selectSession<Package[]>('packages'));
  // #endregion

  // #region UPDATERS
  readonly _createForm = this.updater(
    (state): FormCustomerAddPackageState => ({
      ...state,
      formGroup: new FormGroup({
        packages: new FormArray([new FormGroup(cloneDeep(this._formGroupTemplate))]),
      }),
    })
  );

  readonly addRows = this.updater((state): FormCustomerAddPackageState => {
    (state.formGroup?.get('packages') as FormArray).push(
      new FormGroup(cloneDeep(this._formGroupTemplate))
    );

    return state;
  });

  readonly deleteRow = this.updater((state, index: number): FormCustomerAddPackageState => {
    (state.formGroup?.get('packages') as FormArray).removeAt(index);

    return state;
  });
  // #endregion

  // #region EFFECTS
  readonly packageIdChange = this.effect(
    (
      data$: Observable<{
        index: number;
        value: number;
      }>
    ) =>
      data$.pipe(
        concatLatestFrom(() => [this.formGroup$, this.packages$]),
        tap(([{ index, value }, formGroup, packages]) => {
          const selectedPackage = packages?.find((p) => p.id === value);
          const packageFG = (formGroup?.get('packages') as FormArray).controls[index] as FormGroup;

          packageFG.get('price')?.setValue(selectedPackage?.default_price);
          packageFG.get('count')?.setValue(selectedPackage?.default_count);
        })
      )
  );

  readonly getPackages = this.effect((void$: Observable<void>) =>
    void$.pipe(tap(() => this._store.dispatch(SessionActions.getResource({ key: 'packages' }))))
  );

  readonly submit = this.effect((void$: Observable<void>) =>
    void$.pipe(
      concatLatestFrom(() => this.formGroup$),
      switchMap(([, formGroup]) => {
        this._markAllDirty(formGroup);

        if (formGroup && formGroup.valid) {
          this.setLoading(true);

          return this._customersApiService
            .bulkPurchasePackages(this._customer.id, formGroup.value.packages)
            .pipe(
              tapResponse(
                (response) => {
                  this._messageService.success(response.message ?? '');
                  this._modalRef?.triggerOk();
                  this._modalRef?.destroy();
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
