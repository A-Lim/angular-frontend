import { Injectable, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EMPTY, Observable, finalize, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/component-store';
import { concatLatestFrom } from '@ngrx/effects';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { FormComponentStore } from '@shared/component-stores/form.component-store';
import { Package } from '@modules/packages/models/package.model';
import { PackagesApiService } from '@modules/packages/packages.api-service';

export interface FormEditPackageState {
  loading: boolean;
  formGroup?: FormGroup;
}

export const FormEditPackageInitialState: FormEditPackageState = {
  loading: false,
};

@Injectable()
export class FormEditPackageComponentStore extends FormComponentStore<FormEditPackageState> {
  private _package: Package = inject(NZ_MODAL_DATA);
  private _packagesApiService = inject(PackagesApiService);
  private _messageSvc = inject(NzMessageService);
  private _modalRef = inject(NzModalRef, { optional: true });

  constructor() {
    super(FormEditPackageInitialState);
  }

  // #region SELECTORS
  // #endregion

  // #region UPDATERS
  readonly createForm = this.updater((state): FormEditPackageState => {
    const formGroup = new FormGroup({
      name: new FormControl(this._package.name, [Validators.required]),
      default_count: new FormControl(this._package.default_count, [Validators.required]),
      default_price: new FormControl(this._package.default_price, [Validators.required]),
      description: new FormControl(this._package.description),
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

          return this._packagesApiService.updatePackage(this._package.id, formGroup.value).pipe(
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
