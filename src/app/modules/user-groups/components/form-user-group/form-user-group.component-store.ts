import { Injectable, inject } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import cloneDeep from 'lodash-es/cloneDeep';
import {
  EMPTY,
  Observable,
  combineLatest,
  debounceTime,
  delay,
  distinctUntilChanged,
  filter,
  finalize,
  map,
  of,
  switchMap,
  tap,
  timer,
} from 'rxjs';
import { tapResponse } from '@ngrx/component-store';
import { concatLatestFrom } from '@ngrx/effects';
import { Dictionary } from '@ngrx/entity';
import { Store } from '@ngrx/store';
import { NzMessageService } from 'ng-zorro-antd/message';
import { selectHasPermissions } from '@core/states/auth/auth.selectors';
import { SessionActions } from '@core/states/session/session.actions';
import { selectSession } from '@core/states/session/session.selectors';
import { FormComponentStore } from '@shared/component-stores/form.component-store';
import { PermissionGroup } from '@modules/user-groups/models/permission-group.model';
import { Permission } from '@modules/user-groups/models/permission.model';
import { UserGroup } from '@modules/user-groups/models/usergroup.model';
import { UserGroupsApiService } from '@modules/user-groups/services/user-groups.api-service';

export type CheckboxGroupDict = Dictionary<{
  label: string;
  checked: boolean;
  indeterminate: boolean;
  disabled: boolean;
  checkboxes: Dictionary<{
    label: string;
    checked: boolean;
    disabled: boolean;
  }>;
}>;

export interface FormUserGroupState {
  loading: boolean;
  disabled: boolean;
  userGroup?: UserGroup;
  formGroup?: FormGroup;
  statuses: string[];
}

export const FormUserGroupInitialState: FormUserGroupState = {
  loading: false,
  disabled: false,
  statuses: ['active', 'inactive'],
};

@Injectable()
export class FormUserGroupComponentStore extends FormComponentStore<FormUserGroupState> {
  private _router = inject(Router);
  private _store = inject(Store);
  private _messageSvc = inject(NzMessageService);
  private _userGroupsApiService = inject(UserGroupsApiService);

  constructor() {
    super(FormUserGroupInitialState);
  }

  // #region SELECTORS
  readonly permissionGroups$ = this._store.select(selectSession<PermissionGroup[]>('permissions'));

  readonly userGroup$ = this.select((state) => state.userGroup);

  readonly statuses$ = this.select((state) => state.statuses);

  readonly dataReady$ = combineLatest([this.permissionGroups$, this.userGroup$]).pipe(
    filter(([permissionGroups]) => permissionGroups != undefined)
  );

  readonly checkboxGroups$ = this.select(this.dataReady$, ([permissionGroups, userGroup]) => {
    return this._getCheckboxGroups(permissionGroups, userGroup);
  });
  // #endregion

  // #region UPDATERS
  readonly setUserGroup = this.updater((state, userGroup: UserGroup): FormUserGroupState => {
    state.formGroup?.controls['code'].setAsyncValidators([
      this._codeExistsValidatiorFn(userGroup?.code),
    ]);
    state.formGroup?.patchValue(userGroup);

    if (userGroup.is_admin) state.formGroup?.disable();

    return {
      ...state,
      userGroup,
    };
  });

  readonly createForm = this.updater((state): FormUserGroupState => {
    const formGroup = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      code: new FormControl(null, [Validators.required], [this._codeExistsValidatiorFn()]),
      status: new FormControl(null, [Validators.required]),
    });

    return {
      ...state,
      formGroup,
    };
  });
  // #endregion

  // #region EFFECTS
  readonly getPermissions = this.effect((void$: Observable<void>) =>
    void$.pipe(tap(() => this._store.dispatch(SessionActions.getResource({ key: 'permissions' }))))
  );

  readonly submit = this.effect((permissionIds$: Observable<number[]>) =>
    permissionIds$.pipe(
      concatLatestFrom(() => [this.userGroup$, this.formGroup$]),
      switchMap(([permissionId, userGroup, formGroup]) => {
        this._markAllDirty(formGroup);
        if (formGroup && formGroup.valid) {
          this.setLoading(true);
          const value = formGroup.value;
          value.permissions = permissionId;

          const api = userGroup
            ? this._userGroupsApiService.updateUserGroup(userGroup.id, value)
            : this._userGroupsApiService.createUserGroup(value);

          return api.pipe(
            tapResponse(
              (response) => {
                this._messageSvc.success(response.message ?? '');
                userGroup
                  ? this._router.navigate(['admin/user-groups'])
                  : this._router.navigate([`admin/user-groups/${response.data.id}/edit`]);
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

  // #region FUNCTION
  private _codeExistsValidatiorFn(code?: string): AsyncValidatorFn {
    return (control: AbstractControl) =>
      timer(400).pipe(
        distinctUntilChanged(),
        filter(() => code != control.value),
        switchMap(() =>
          this._userGroupsApiService
            .checkCodeExists(control.value)
            .pipe(map((response) => (response.data ? { exists: true } : null)))
        )
      );
  }

  private _getCheckboxGroups(
    permissionGroup?: PermissionGroup[],
    userGroup?: UserGroup
  ): CheckboxGroupDict {
    const permissionIds = userGroup?.permissions?.map((permission) => permission.id) ?? [];

    const checkboxGroupDict: CheckboxGroupDict = {};

    permissionGroup?.forEach((group) => {
      let checkedCount = 0;
      const checkboxDict: Dictionary<{
        label: string;
        checked: boolean;
        disabled: boolean;
      }> = {};

      group.permissions.forEach((permission) => {
        const checked = permissionIds.includes(permission.id);
        if (checked) checkedCount++;

        checkboxDict[permission.id] = {
          label: permission.name,
          checked: userGroup?.is_admin ? true : checked,
          disabled: userGroup?.is_admin ?? false,
        };
      });

      const checkboxDictCount = Object.entries(checkboxDict).length;
      checkboxGroupDict[group.code] = {
        label: group.name,
        checked: userGroup?.is_admin ? true : checkedCount === checkboxDictCount,
        indeterminate: userGroup?.is_admin
          ? false
          : checkedCount > 0 && checkedCount < checkboxDictCount,
        disabled: userGroup?.is_admin ?? false,
        checkboxes: checkboxDict,
      };
    });

    return checkboxGroupDict;
  }
  // #endregion
}
