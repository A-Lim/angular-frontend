import { Injectable, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import cloneDeep from 'lodash-es/cloneDeep';
import { EMPTY, Observable, finalize, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/component-store';
import { concatLatestFrom } from '@ngrx/effects';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { FormComponentStore } from '@shared/component-stores/form.component-store';
import { PackagesApiService } from '@modules/packages/packages.api-service';

export interface FormCreatePackagesState {
  loading: boolean;
  formGroup?: FormGroup;
}

export const FormCreatePackagesInitialState: FormCreatePackagesState = {
  loading: false,
};

@Injectable()
export class FormCreatePackagesComponentStore extends FormComponentStore<FormCreatePackagesState> {
  private _packagesApiService = inject(PackagesApiService);
  private _messageSvc = inject(NzMessageService);
  private _modalRef = inject(NzModalRef, { optional: true });

  private readonly _formGroup = {
    name: new FormControl(null, [Validators.required]),
    default_count: new FormControl(null, [Validators.required]),
    default_price: new FormControl(null, [Validators.required]),
    description: new FormControl(null),
  };

  constructor() {
    super(FormCreatePackagesInitialState);
  }

  // #region SELECTORS
  // #endregion

  // #region UPDATERS
  readonly createForm = this.updater((state): FormCreatePackagesState => {
    const formGroup = new FormGroup({
      packages: new FormArray([new FormGroup(cloneDeep(this._formGroup))]),
    });
    return {
      ...state,
      formGroup,
    };
  });

  readonly addRows = this.updater((state): FormCreatePackagesState => {
    (state.formGroup?.get('packages') as FormArray).push(new FormGroup(cloneDeep(this._formGroup)));

    return state;
  });

  readonly deleteRow = this.updater((state, index: number): FormCreatePackagesState => {
    (state.formGroup?.get('packages') as FormArray).removeAt(index);

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

          return this._packagesApiService.bulkCreatePackages(formGroup.value.packages).pipe(
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
