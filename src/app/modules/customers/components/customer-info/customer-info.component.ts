import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  inject,
} from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Customer } from '@modules/customers/models/customer.model';
import { CustomerInfoComponentStore } from './customer-info.component-store';

@Component({
  selector: 'app-customer-info',
  standalone: true,
  imports: [NgIf, NzButtonModule, NzIconModule, TranslocoModule],
  templateUrl: './customer-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CustomerInfoComponentStore],
})
export class CustomerInfoComponent {
  @Input({ required: true }) customer!: Customer;

  private _cdr = inject(ChangeDetectorRef);
  private _componentStore = inject(CustomerInfoComponentStore);

  openEditCustomerModal() {
    this._componentStore.openEditCustomerModal({
      customer: this.customer,
      onOk: (customer) => {
        this.customer = customer;
        this._cdr.markForCheck();
      },
    });
  }
}
