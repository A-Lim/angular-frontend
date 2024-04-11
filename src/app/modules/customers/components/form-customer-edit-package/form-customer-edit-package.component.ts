import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { UiFormControlErrorsComponent } from '@shared/components/ui-form-control-errors/ui-form-control-errors.component';
import { CustomerPackage } from '@modules/customers/models/customer-package.model';
import { FormCustomerEditPackageComponentStore } from './form-customer-edit-package.component-store';

@Component({
  selector: 'app-form-customer-edit-package',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    UiFormControlErrorsComponent,
    NzButtonModule,
    NzFormModule,
    NzInputModule,
    NzModalModule,
    ReactiveFormsModule,
    TranslocoModule,
  ],
  templateUrl: './form-customer-edit-package.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FormCustomerEditPackageComponentStore],
})
export class FormCustomerEditPackageComponent implements OnInit {
  @Input({ required: true }) customerPackage!: CustomerPackage;

  private _componentStore = inject(FormCustomerEditPackageComponentStore);
  readonly formGroup$ = this._componentStore.formGroup$;
  readonly loading$ = this._componentStore.loading$;

  ngOnInit() {
    this._componentStore.createForm(this.customerPackage);
  }

  submit() {
    this._componentStore.submit(this.customerPackage.id);
  }
}
