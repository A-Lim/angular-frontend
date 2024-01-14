import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ComponentStore } from '@ngrx/component-store';

export interface FormState {
  loading: boolean;
  formGroup?: FormGroup;
}

export class FormComponentStore<T extends FormState> extends ComponentStore<T> {
  constructor(public initialState: T) {
    super(initialState);
  }

  // #region SELECTORS
  readonly loading$ = this.select((state) => state.loading);

  readonly formGroup$ = this.select((state) => state.formGroup);
  // #endregion

  // #region UPDATERS
  readonly setLoading = this.updater(
    (state, loading: boolean): T => ({
      ...state,
      loading,
    })
  );
  // #endregion

  // #region FUNCTIONS
  protected _markAllDirty(formGroup?: FormGroup) {
    if (!formGroup) return;

    Object.keys(formGroup.controls).forEach((key) => {
      switch (formGroup.get(key)?.constructor.name) {
        case 'FormGroup':
          this._markAllDirty(formGroup.get(key) as FormGroup);
          break;

        case 'FormArray':
          this._markArrayDirty(formGroup.get(key) as FormArray);
          break;

        case 'FormControl':
          const control = formGroup.get(key) as FormControl;
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
          break;
      }
    });
  }

  private _markArrayDirty(formArray: FormArray) {
    formArray.controls.forEach((control) => {
      switch (control.constructor.name) {
        case 'FormGroup':
          this._markAllDirty(control as FormGroup);
          break;

        case 'FormArray':
          this._markArrayDirty(control as FormArray);
          break;

        case 'FormControl':
          (control as FormControl).markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
          break;
      }
    });
  }
  // #endregion
}
