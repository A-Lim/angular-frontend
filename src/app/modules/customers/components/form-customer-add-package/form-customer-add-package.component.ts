import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { UiFormControlErrorsComponent } from '@shared/components/ui-form-control-errors/ui-form-control-errors.component';
import { FormArrayCastPipe } from '@shared/pipes/form-array-cast.pipe';
import { FormCustomerAddPackageComponentStore } from './form-customer-add-package.component-store';

@Component({
  selector: 'app-form-customer-add-package',
  standalone: true,
  imports: [
    AsyncPipe,
    FormArrayCastPipe,
    NgClass,
    NgFor,
    NgIf,
    UiFormControlErrorsComponent,
    NzButtonModule,
    NzToolTipModule,
    NzFormModule,
    NzInputModule,
    NzModalModule,
    NzSelectModule,
    NzIconModule,
    ReactiveFormsModule,
    TranslocoModule,
  ],
  templateUrl: './form-customer-add-package.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FormCustomerAddPackageComponentStore],
})
export class FormCustomerAddPackageComponent implements OnInit {
  private _componentStore = inject(FormCustomerAddPackageComponentStore);

  readonly formGroup$ = this._componentStore.formGroup$;
  readonly loading$ = this._componentStore.loading$;
  readonly packages$ = this._componentStore.packages$;

  ngOnInit() {
    this._componentStore.getPackages();
  }

  packageIdChange(index: number, value: number) {
    this._componentStore.packageIdChange({ index, value });
  }

  addRow() {
    this._componentStore.addRows();
  }

  deleteRow(index: number) {
    this._componentStore.deleteRow(index);
  }

  submit() {
    this._componentStore.submit();
  }
}
