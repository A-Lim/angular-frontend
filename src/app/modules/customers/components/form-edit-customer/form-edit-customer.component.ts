import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { UiFormControlErrorsComponent } from '@shared/components/ui-form-control-errors/ui-form-control-errors.component';
import { FormEditCustomerComponentStore } from './form-edit-customer.component-store';

@Component({
  selector: 'app-form-edit-customer',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    ReactiveFormsModule,
    NzButtonModule,
    NzFormModule,
    NzInputModule,
    NzModalModule,
    UiFormControlErrorsComponent,
    TranslocoModule,
  ],
  templateUrl: './form-edit-customer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FormEditCustomerComponentStore],
})
export class FormEditCustomerComponent {
  private _formEditCustomerComponentStore = inject(FormEditCustomerComponentStore);
  readonly formGroup$ = this._formEditCustomerComponentStore.formGroup$;
  readonly loading$ = this._formEditCustomerComponentStore.loading$;

  submit() {
    this._formEditCustomerComponentStore.submit();
  }
}
