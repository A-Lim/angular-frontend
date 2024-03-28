import { ChangeDetectionStrategy, Component, ViewChild, inject } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { UiBreadcrumbComponent } from '@shared/components/ui-breadcrumb/ui-breadcrumb.component';
import { LayoutPageContentComponent } from '@shared/layouts/layout-page-content/layout-page-content.component';
import { TableCustomersComponent } from '@modules/customers/components/table-customers/table-customers.component';
import { PageCustomersComponentStore } from './page-customers.component-store';

@Component({
  selector: 'app-page-customers',
  standalone: true,
  imports: [
    LayoutPageContentComponent,
    UiBreadcrumbComponent,
    NzButtonModule,
    NzCardModule,
    NzModalModule,
    TranslocoModule,
    TableCustomersComponent,
  ],
  templateUrl: './page-customers.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PageCustomersComponentStore],
})
export class PageCustomersComponent {
  @ViewChild('tableCustomers', { static: true }) tableCustomers!: TableCustomersComponent;

  private _pageCustomersComponentStore = inject(PageCustomersComponentStore);

  createCustomersModal() {
    this._pageCustomersComponentStore.createCustomersModal(() =>
      this.tableCustomers.grid.refreshTable()
    );
  }
}
