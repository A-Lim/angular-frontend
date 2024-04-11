import { ChangeDetectionStrategy, Component, Input, ViewChild, inject } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { Customer } from '@modules/customers/models/customer.model';
import { FormCustomerAddPackageComponent } from '../form-customer-add-package/form-customer-add-package.component';
import { TableCustomerPackagesComponent } from '../table-customer-packages/table-customer-packages.component';
import { TabCustomerPackagesComponentStore } from './tab-customer-packages.component-store';

@Component({
  selector: 'app-tab-customer-packages',
  standalone: true,
  imports: [
    TableCustomerPackagesComponent,
    FormCustomerAddPackageComponent,
    NzButtonModule,
    NzModalModule,
    TranslocoModule,
  ],
  template: `
    <div class="flex justify-end mb-4" *transloco="let trans">
      <button nz-button [nzType]="'primary'" (click)="openAddPackageModal()">
        {{ trans('add-package') }}
      </button>
    </div>
    <app-table-customer-packages
      #tableCustomerPackages
      [customerId]="customer.id"
    ></app-table-customer-packages>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TabCustomerPackagesComponentStore],
})
export class TabCustomerPackagesComponent {
  @Input({ required: true }) customer!: Customer;
  @ViewChild('tableCustomerPackages', { static: true })
  tableCustomerPackages!: TableCustomerPackagesComponent;

  private _componentStore = inject(TabCustomerPackagesComponentStore);

  openAddPackageModal() {
    this._componentStore.openAddPackageModal({
      customer: this.customer,
      onOk: () => this.tableCustomerPackages.refreshTable(),
    });
  }
}
