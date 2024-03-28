import { AsyncPipe, NgIf, NgSwitch, NgSwitchCase, TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
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
import { Customer } from '@modules/customers/models/customer.model';
import { TableCustomersComponentStore } from './table-customers.component-store';

@Component({
  selector: 'app-table-customers',
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
  templateUrl: './table-customers.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TableCustomersComponentStore],
})
export class TableCustomersComponent implements OnInit {
  @ViewChild('grid', { static: true }) grid!: UiGridComponent;
  @ViewChild('actionsCell', { static: true }) actionsCell!: TemplateRef<any>;

  private _tableCustomersComponentStore = inject(TableCustomersComponentStore);
  readonly columnDefs$ = this._tableCustomersComponentStore.columnDefs$;
  readonly dataSource$ = this._tableCustomersComponentStore.dataSource$;

  ngOnInit() {
    this._tableCustomersComponentStore.setActionCell(this.actionsCell);
  }

  editCustomerModal(customer: Customer) {
    this._tableCustomersComponentStore.editCustomerModal({
      customer,
      onOk: () => this.grid.refreshTable(),
    });
  }

  deleteCustomer(id: number) {
    this._tableCustomersComponentStore.deleteCustomer({
      id,
      onComplete: () => this.grid.refreshTable(),
    });
  }
}
