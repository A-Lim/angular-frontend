import { AsyncPipe, NgIf, NgSwitch, NgSwitchCase, TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { UiGridComponent } from '@shared/components/ui-grid/ui-grid.component';
import { UiTemplateRendererComponent } from '@shared/components/ui-template-renderer/ui-template-renderer.component';
import { HasPermissionDirective } from '@shared/directives/has-permission.directive';
import { CustomerPackage } from '@modules/customers/models/customer-package.model';
import { TableCustomerPackagesComponentStore } from './table-customer-packages.component-store';

@Component({
  selector: 'app-table-customer-packages',
  standalone: true,
  imports: [
    NgIf,
    NgSwitch,
    NgSwitchCase,
    AsyncPipe,
    TitleCasePipe,
    RouterLink,
    HasPermissionDirective,
    UiGridComponent,
    UiTemplateRendererComponent,
    NzTagModule,
    NzButtonModule,
    NzModalModule,
    NzToolTipModule,
    NzIconModule,
    TranslocoModule,
  ],
  templateUrl: './table-customer-packages.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TableCustomerPackagesComponentStore],
})
export class TableCustomerPackagesComponent implements OnInit {
  private _componentStore = inject(TableCustomerPackagesComponentStore);

  @Input({ required: true }) set customerId(value: number) {
    this._componentStore.setCustomerId(value);
  }
  @ViewChild('grid', { static: true }) grid!: UiGridComponent;
  @ViewChild('statusCell', { static: true }) statusCell!: TemplateRef<any>;
  @ViewChild('actionsCell', { static: true }) actionsCell!: TemplateRef<any>;

  readonly columnDefs$ = this._componentStore.columnDefs$;
  readonly dataSource$ = this._componentStore.dataSource$;

  ngOnInit() {
    this._componentStore.setStatusCell(this.statusCell);
    this._componentStore.setActionCell(this.actionsCell);
  }

  refreshTable() {
    this.grid.refreshTable();
  }

  editCustomerPackageModal(customerPackage: CustomerPackage) {
    this._componentStore.editCustomerPackageModal({
      customerPackage,
      onOk: () => this.grid.refreshTable(),
    });
  }

  deleteCustomerPackage(id: number) {
    this._componentStore.deleteCustomerPackage({
      id,
      onComplete: () => this.grid.refreshTable(),
    });
  }
}
