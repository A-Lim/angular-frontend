import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { environment } from '@environments/environment';
import { TranslocoModule } from '@ngneat/transloco';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { UiFormControlErrorsComponent } from '@shared/components/ui-form-control-errors/ui-form-control-errors.component';
import { FormArrayCastPipe } from '@shared/pipes/form-array-cast.pipe';
import { FormGroupCastPipe } from '@shared/pipes/form-group-cast.pipe';
import { FormCustomerAddTransactionComponentStore } from './form-customer-add-transaction.component-store';

@Component({
  selector: 'app-form-customer-add-transaction',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    NgClass,
    NgFor,
    FormArrayCastPipe,
    FormGroupCastPipe,
    UiFormControlErrorsComponent,
    ReactiveFormsModule,
    NzButtonModule,
    NzDatePickerModule,
    NzFormModule,
    NzIconModule,
    NzInputModule,
    NzModalModule,
    NzSelectModule,
    NzToolTipModule,
    TranslocoModule,
  ],
  templateUrl: './form-customer-add-transaction.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FormCustomerAddTransactionComponentStore],
})
export class FormCustomerAddTransactionComponent implements OnInit {
  private _componentStore = inject(FormCustomerAddTransactionComponentStore);

  readonly formGroup$ = this._componentStore.formGroup$;
  readonly loading$ = this._componentStore.loading$;
  readonly customerPackageBalances$ = this._componentStore.customerPackageBalances$;
  readonly DATETIME_FORMAT = environment.dateTimeFormat;

  ngOnInit() {
    this._componentStore.getCustomerPackageBalances();
  }

  submit() {
    this._componentStore.submit();
  }

  addRow() {
    this._componentStore.addRow();
  }

  deleteRow(index: number) {
    this._componentStore.deleteRow(index);
  }
}
