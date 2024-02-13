import { Injectable, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EMPTY, Observable, finalize, switchMap } from 'rxjs';
import { tapResponse } from '@ngrx/component-store';
import { concatLatestFrom } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { NzMessageService } from 'ng-zorro-antd/message';
import { User } from '@core/models/user.model';
import { AuthActions } from '@core/states/auth/auth.actions';
import { selectUser } from '@core/states/auth/auth.selectors';
import { FormComponentStore } from '@shared/component-stores/form.component-store';
import { ProfileApiService } from '@modules/users/services/profile.api-service';

export interface FormProfileState {
  user?: User | null;
  loading: boolean;
  formGroup?: FormGroup;
  genders: string[];
}

export const FormProfileInitialState: FormProfileState = {
  loading: false,
  genders: ['male', 'female'],
};

@Injectable()
export class FormProfileComponentStore extends FormComponentStore<FormProfileState> {
  private _store = inject(Store);
  private _profileApiService = inject(ProfileApiService);
  private _messageService = inject(NzMessageService);

  constructor() {
    super(FormProfileInitialState);
  }

  // #region SELECTORS
  readonly user$ = this._store.select(selectUser);

  readonly genders$ = this.select((state) => state.genders);
  // #endregion

  // #region UPDATERS
  readonly setUser = this.updater(
    (state, user: User | undefined | null): FormProfileState => {
      return {
        ...state,
        user,
      };
    }
  );

  readonly createForm = this.updater((state): FormProfileState => {
    const dateOfBirth = state.user?.date_of_birth
      ? new Date(state.user.date_of_birth)
      : null;
    const formGroup = new FormGroup({
      name: new FormControl(state.user?.name, [Validators.required]),
      email: new FormControl(state.user?.email, [
        Validators.required,
        Validators.email,
      ]),
      gender: new FormControl(state.user?.gender),
      phone: new FormControl(state.user?.phone),
      date_of_birth: new FormControl(dateOfBirth),
      oldPassword: new FormControl(),
      newPassword: new FormControl(),
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
      concatLatestFrom(() => [this.formGroup$]),
      switchMap(([, formGroup]) => {
        this._markAllDirty(formGroup);
        if (formGroup && formGroup.valid) {
          this.setLoading(true);
          return this._profileApiService.updateProfile(formGroup.value).pipe(
            tapResponse(
              (response) => {
                this._messageService.success(response.message ?? '');
                this._store.dispatch(
                  AuthActions.updateProfile({ user: response.data })
                );
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
