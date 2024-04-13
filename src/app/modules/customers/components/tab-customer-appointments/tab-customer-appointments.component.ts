import { ChangeDetectionStrategy, Component, Input, ViewChild, inject } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { Customer } from '@modules/customers/models/customer.model';
import { TableCustomerAppointmentsComponent } from '../table-customer-appointments/table-customer-appointments.component';
import { TabCustomerAppointmentsComponentStore } from './tab-customer-appointments.component-store';

@Component({
  selector: 'app-tab-customer-appointments',
  standalone: true,
  imports: [TableCustomerAppointmentsComponent, NzButtonModule, TranslocoModule],
  template: `
    <div class="flex justify-end mb-4" *transloco="let trans">
      <button nz-button [nzType]="'primary'" (click)="openAddTransactionModal()">
        {{ trans('add-transaction') }}
      </button>
    </div>
    <app-table-customer-appointments
      #tableCustomerAppointments
      [customerId]="customer.id"
    ></app-table-customer-appointments>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TabCustomerAppointmentsComponentStore],
})
export class TabCustomerAppointmentsComponent {
  @Input({ required: true }) customer!: Customer;

  @ViewChild('tableCustomerAppointments', { static: true })
  tableCustomerAppointments!: TableCustomerAppointmentsComponent;

  private _componentStore = inject(TabCustomerAppointmentsComponentStore);

  openAddTransactionModal() {
    this._componentStore.openAddTransactionModal({
      customer: this.customer,
      onOk: () => this.tableCustomerAppointments.refreshTable(),
    });
  }
}
