import { AsyncPipe, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { UiFormControlErrorsComponent } from '@shared/components/ui-form-control-errors/ui-form-control-errors.component';
import { Customer } from '@modules/customers/models/customer.model';
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
    UiFormControlErrorsComponent,
    TranslocoModule,
  ],
  templateUrl: './form-edit-customer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FormEditCustomerComponentStore],
})
export class FormEditCustomerComponent implements OnChanges {
  @Input() customer: Customer | undefined | null;

  private _formEditCustomerComponentStore = inject(FormEditCustomerComponentStore);
  readonly formGroup$ = this._formEditCustomerComponentStore.formGroup$;
  readonly loading$ = this._formEditCustomerComponentStore.loading$;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['customer'] && this.customer) {
      this._formEditCustomerComponentStore.patchForm(this.customer);
    }
  }

  submit() {
    if (this.customer) {
      this._formEditCustomerComponentStore.submit(this.customer.id);
    }
  }
}
