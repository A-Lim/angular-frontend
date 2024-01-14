import { Injectable, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EMPTY, Observable, finalize, switchMap } from 'rxjs';
import { tapResponse } from '@ngrx/component-store';
import { concatLatestFrom } from '@ngrx/effects';
import { NzMessageService } from 'ng-zorro-antd/message';
import { User } from '@core/models/user.model';
import { FormComponentStore } from '@shared/component-stores/form.component-store';
import { UsersApiService } from '@modules/users/services/users.api-service';

export interface FormUserState {
  loading: boolean;
  user?: User | null;
  formGroup?: FormGroup;
  statuses: string[];
}

export const FormUserInitialState: FormUserState = {
  loading: false,
  statuses: ['active', 'locked', 'unverified', 'inactive'],
};

@Injectable()
export class FormUserComponentStore extends FormComponentStore<FormUserState> {
  private _router = inject(Router);
  private _usersApiService = inject(UsersApiService);
  private _messageSvc = inject(NzMessageService);

  constructor() {
    super(FormUserInitialState);
  }

  // #region SELECTORS
  readonly user$ = this.select((state) => state.user);

  readonly statuses$ = this.select((state) => state.statuses);
  // #endregion

  // #region UPDATERS
  readonly setUser = this.updater(
    (state, user: User | undefined | null): FormUserState => {
      return {
        ...state,
        user,
      };
    }
  );

  readonly createForm = this.updater((state): FormUserState => {
    const dateOfBirth = state.user?.date_of_birth
      ? new Date(state.user.date_of_birth)
      : null;
    const formGroup = new FormGroup({
      name: new FormControl(state.user?.name, [Validators.required]),
      email: new FormControl(state.user?.email, [
        Validators.required,
        Validators.email,
      ]),
      phone: new FormControl(state.user?.phone),
      gender: new FormControl(state.user?.gender),
      date_of_birth: new FormControl(dateOfBirth),
      status: new FormControl(state.user?.status, [Validators.required]),
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
      concatLatestFrom(() => [this.formGroup$, this.user$]),
      switchMap(([, formGroup, user]) => {
        this._markAllDirty(formGroup);
        if (formGroup && formGroup.valid) {
          this.setLoading(true);
          return this._usersApiService
            .updateUser(user!.id, formGroup.value)
            .pipe(
              tapResponse(
                (response) => {
                  this._messageSvc.success(response.message ?? '');
                  this._router.navigate(['admin/users']);
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
