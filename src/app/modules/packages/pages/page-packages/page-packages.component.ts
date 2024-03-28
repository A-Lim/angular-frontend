import { ChangeDetectionStrategy, Component, ViewChild, inject } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { UiBreadcrumbComponent } from '@shared/components/ui-breadcrumb/ui-breadcrumb.component';
import { LayoutPageContentComponent } from '@shared/layouts/layout-page-content/layout-page-content.component';
import { TablePackagesComponent } from '@modules/packages/components/table-packages/table-packages.component';
import { PagePackagesComponentStore } from './page-packages.component-store';

@Component({
  selector: 'app-page-packages',
  standalone: true,
  imports: [
    LayoutPageContentComponent,
    UiBreadcrumbComponent,
    NzButtonModule,
    NzCardModule,
    NzModalModule,
    TranslocoModule,
    TablePackagesComponent,
  ],
  templateUrl: './page-packages.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PagePackagesComponentStore],
})
export class PagePackagesComponent {
  @ViewChild('tablePackages', { static: true }) tablePackages!: TablePackagesComponent;

  private _pagePackagesComponentStore = inject(PagePackagesComponentStore);

  createPackagesModal() {
    this._pagePackagesComponentStore.createPackagesModal(() =>
      this.tablePackages.grid.refreshTable()
    );
  }
}
