import { ChangeDetectionStrategy, Component, ViewChild, inject } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { UiBreadcrumbComponent } from '@shared/components/ui-breadcrumb/ui-breadcrumb.component';
import { LayoutPageContentComponent } from '@shared/layouts/layout-page-content/layout-page-content.component';
import { FormCreateContactsComponent } from '@modules/contacts/components/form-create-contacts/form-create-contacts.component';
import { TableContactsComponent } from '@modules/contacts/components/table-contacts/table-contacts.component';
import { PageContactsComponentStore } from './page-contacts.component-store';

@Component({
  selector: 'app-page-contacts',
  standalone: true,
  imports: [
    LayoutPageContentComponent,
    UiBreadcrumbComponent,
    NzButtonModule,
    NzCardModule,
    NzModalModule,
    TranslocoModule,
    TableContactsComponent,
  ],
  templateUrl: './page-contacts.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PageContactsComponentStore],
})
export class PageContactsComponent {
  @ViewChild('tableContacts', { static: true }) tableContacts!: TableContactsComponent;

  private _pageContactsComponentStore = inject(PageContactsComponentStore);

  createContactsModal() {
    this._pageContactsComponentStore.createContactsModal(() =>
      this.tableContacts.grid.refreshTable()
    );
  }
}
