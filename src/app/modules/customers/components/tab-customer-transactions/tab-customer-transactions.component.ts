import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { Customer } from '@modules/customers/models/customer.model';
import { TableCustomerTransactionsComponent } from '../table-customer-transactions/table-customer-transactions.component';

@Component({
  selector: 'app-tab-customer-transactions',
  standalone: true,
  imports: [TableCustomerTransactionsComponent, TranslocoModule],
  template: `
    <app-table-customer-transactions [customerId]="customer.id"></app-table-customer-transactions>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabCustomerTransactionsComponent {
  @Input({ required: true }) customer!: Customer;
}
