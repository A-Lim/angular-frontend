import {
  AsyncPipe,
  KeyValuePipe,
  NgFor,
  NgIf,
  TitleCasePipe,
  UpperCasePipe,
} from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { UiFormControlErrorsComponent } from '@shared/components/ui-form-control-errors/ui-form-control-errors.component';
import { UserGroup } from '@modules/user-groups/models/usergroup.model';
import { CheckboxGroupDict, FormUserGroupComponentStore } from './form-user-group.component-store';

@UntilDestroy()
@Component({
  selector: 'app-form-user-group',
  standalone: true,
  imports: [
    AsyncPipe,
    KeyValuePipe,
    TitleCasePipe,
    UpperCasePipe,
    NgIf,
    NgFor,
    FormsModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzCheckboxModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    UiFormControlErrorsComponent,
    TranslocoModule,
  ],
  templateUrl: './form-user-group.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FormUserGroupComponentStore],
})
export class FormUserGroupComponent implements OnInit {
  @Input() set userGroup(value: UserGroup | undefined | null) {
    if (value) {
      this._formUserGroupComponentStore.setUserGroup(value);
    }
  }

  // using local variable instead of using component store
  // to provide via async is to prevent checkbox from rerendering
  // everytime there are changes
  protected checkboxGroups?: CheckboxGroupDict;
  private _formUserGroupComponentStore = inject(FormUserGroupComponentStore);

  readonly userGroup$ = this._formUserGroupComponentStore.userGroup$;
  readonly formGroup$ = this._formUserGroupComponentStore.formGroup$;
  readonly loading$ = this._formUserGroupComponentStore.loading$;
  readonly statuses$ = this._formUserGroupComponentStore.statuses$;

  ngOnInit() {
    this._formUserGroupComponentStore.createForm();
    this._formUserGroupComponentStore.getPermissions();
    this._formUserGroupComponentStore.checkboxGroups$
      .pipe(untilDestroyed(this))
      .subscribe((checkboxGroups) => (this.checkboxGroups = checkboxGroups));
  }

  moduleChange(module: string, value: boolean) {
    if (!this.checkboxGroups) return;

    const checkboxModule = this.checkboxGroups[module];
    if (checkboxModule) {
      checkboxModule.checked = value;
      checkboxModule.indeterminate = false;

      for (const key in checkboxModule.checkboxes) {
        checkboxModule.checkboxes[key]!.checked = value;
      }
    }

    this.checkboxGroups[module] = checkboxModule;
  }

  permissionChange(module: string, id: string, value: boolean) {
    if (!this.checkboxGroups) return;

    this.checkboxGroups[module]!.checkboxes[id]!.checked = value;

    const entries = Object.entries(this.checkboxGroups[module]!.checkboxes);
    const checkedCount = entries.filter((entry) => entry[1]?.checked).length;
    const totalCount = entries.length;

    this.checkboxGroups[module]!.checked = checkedCount == totalCount;
    this.checkboxGroups[module]!.indeterminate = checkedCount > 0 && checkedCount < totalCount;
  }

  submit() {
    const permissionIds = this._getPermissionIds();
    this._formUserGroupComponentStore.submit(permissionIds);
  }

  trackByPermissionId(_index: number, item: { key: string; value: any }) {
    return `${item.key}:${item.value.checked}`;
  }

  private _getPermissionIds() {
    const permissionIds: number[] = [];

    for (let module in this.checkboxGroups) {
      for (let id in this.checkboxGroups[module]?.checkboxes) {
        if (this.checkboxGroups[module]?.checkboxes[id]?.checked) {
          permissionIds.push(Number(id));
        }
      }
    }

    return permissionIds;
  }
}
