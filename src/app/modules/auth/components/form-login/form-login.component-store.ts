import { Injectable, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EMPTY, Observable, tap } from 'rxjs';
import { concatLatestFrom } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AuthActions } from '@core/state/auth.actions';
import { selectAuthenticating } from '@core/state/auth.selectors';
import { FormComponentStore } from '@shared/component-stores/form.component-store';

export interface FormLoginState {
  loading: boolean;
  formGroup?: FormGroup;
}

export const FormLoginInitialState: FormLoginState = {
  loading: false,
};

@Injectable()
export class FormLoginComponentStore extends FormComponentStore<FormLoginState> {
  private _store = inject(Store);

  constructor() {
    super(FormLoginInitialState);
  }

  // #region SELECTORS
  override readonly loading$ = this._store.select(selectAuthenticating);
  // #endregion

  // #region UPDATERS
  readonly createForm = this.updater((state): FormLoginState => {
    const formGroup = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
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
      tap(([, formGroup]) => {
        this._markAllDirty(formGroup);
        if (formGroup && formGroup.valid) {
          this.setLoading(true);
          this._store.dispatch(AuthActions.login(formGroup.value));
        }
      })
    )
  );
  // #endregion
}
