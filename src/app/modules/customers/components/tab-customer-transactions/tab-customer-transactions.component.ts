import { ChangeDetectionStrategy, Component, Input, ViewChild, inject } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { Customer } from '@modules/customers/models/customer.model';
import { TableCustomerTransactionsComponent } from '../table-customer-transactions/table-customer-transactions.component';
import { TabCustomerTransactionsComponentStore } from './tab-customer-transactions.component-store';

@Component({
  selector: 'app-tab-customer-transactions',
  standalone: true,
  imports: [TableCustomerTransactionsComponent, NzButtonModule, TranslocoModule],
  template: `
    <div class="flex justify-end mb-4" *transloco="let trans">
      <button nz-button [nzType]="'primary'" (click)="openAddTransactionModal()">
        {{ trans('add-transaction') }}
      </button>
    </div>
    <app-table-customer-transactions
      #tableCustomerTransactions
      [customerId]="customer.id"
    ></app-table-customer-transactions>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TabCustomerTransactionsComponentStore],
})
export class TabCustomerTransactionsComponent {
  @Input({ required: true }) customer!: Customer;

  @ViewChild('tableCustomerTransactions', { static: true })
  tableCustomerTransactions!: TableCustomerTransactionsComponent;

  private _componentStore = inject(TabCustomerTransactionsComponentStore);

  openAddTransactionModal() {
    this._componentStore.openAddTransactionModal({
      customer: this.customer,
      onOk: () => this.tableCustomerTransactions.refreshTable(),
    });
  }
}
