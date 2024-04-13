import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { UiBreadcrumbComponent } from '@shared/components/ui-breadcrumb/ui-breadcrumb.component';
import { LayoutPageContentComponent } from '@shared/layouts/layout-page-content/layout-page-content.component';
import { CustomerInfoComponent } from '@modules/customers/components/customer-info/customer-info.component';
import { FormEditCustomerComponent } from '@modules/customers/components/form-edit-customer/form-edit-customer.component';
import { TabCustomerAppointmentsComponent } from '@modules/customers/components/tab-customer-appointments/tab-customer-appointments.component';
import { TabCustomerPackagesComponent } from '@modules/customers/components/tab-customer-packages/tab-customer-packages.component';
import { TabCustomerTransactionsComponent } from '@modules/customers/components/tab-customer-transactions/tab-customer-transactions.component';
import { TableCustomerTransactionsComponent } from '@modules/customers/components/table-customer-transactions/table-customer-transactions.component';
import { PageCustomerManageComponentStore } from './page-customer-manage.component-store';

@Component({
  selector: 'app-page-customer-manage',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    RouterLink,
    CustomerInfoComponent,
    TabCustomerPackagesComponent,
    TabCustomerTransactionsComponent,
    TabCustomerAppointmentsComponent,
    LayoutPageContentComponent,
    UiBreadcrumbComponent,
    NzCardModule,
    NzIconModule,
    NzTabsModule,
    TranslocoModule,
  ],
  templateUrl: './page-customer-manage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PageCustomerManageComponentStore],
})
export class PageCustomerManageComponent implements OnInit {
  @Input() id?: number;

  private _pageCustomerManageComponentStore = inject(PageCustomerManageComponentStore);
  readonly customer$ = this._pageCustomerManageComponentStore.customer$;

  ngOnInit() {
    if (this.id) this._pageCustomerManageComponentStore.getCustomer(this.id);
  }
}
