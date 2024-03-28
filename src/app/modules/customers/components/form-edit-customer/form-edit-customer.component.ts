import { AsyncPipe, CommonModule, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NZ_MODAL_DATA, NzModalModule } from 'ng-zorro-antd/modal';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { UiFormControlErrorsComponent } from '@shared/components/ui-form-control-errors/ui-form-control-errors.component';
import { Customer } from '@modules/customers/models/customer.model';
import { FormEditCustomerComponentStore } from './form-edit-customer.component-store';

@Component({
  selector: 'app-form-edit-customer',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    NgFor,
    ReactiveFormsModule,
    NzButtonModule,
    NzFormModule,
    NzInputModule,
    NzToolTipModule,
    NzIconModule,
    NzModalModule,
    UiFormControlErrorsComponent,
    TranslocoModule,
  ],
  templateUrl: './form-edit-customer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FormEditCustomerComponentStore],
})
export class FormEditCustomerComponent implements OnInit {
  private _formEditCustomerComponentStore = inject(FormEditCustomerComponentStore);

  readonly formGroup$ = this._formEditCustomerComponentStore.formGroup$;
  readonly loading$ = this._formEditCustomerComponentStore.loading$;

  ngOnInit() {
    this._formEditCustomerComponentStore.createForm();
  }

  submit() {
    this._formEditCustomerComponentStore.submit();
  }
}
