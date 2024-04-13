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
import { TranslocoModule } from '@ngneat/transloco';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { UiGridComponent } from '@shared/components/ui-grid/ui-grid.component';
import { UiTemplateRendererComponent } from '@shared/components/ui-template-renderer/ui-template-renderer.component';
import { HasPermissionDirective } from '@shared/directives/has-permission.directive';
import { Appointment } from '@modules/customers/models/appontment.model';
import { TableCustomerAppointmentsComponentStore } from './table-customer-appointments.component-store';

@Component({
  selector: 'app-table-customer-appointments',
  standalone: true,
  imports: [
    NgIf,
    NgSwitch,
    NgSwitchCase,
    AsyncPipe,
    TitleCasePipe,
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
  templateUrl: './table-customer-appointments.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TableCustomerAppointmentsComponentStore],
})
export class TableCustomerAppointmentsComponent implements OnInit {
  private _componentStore = inject(TableCustomerAppointmentsComponentStore);

  @Input({ required: true }) set customerId(value: number) {
    this._componentStore.setCustomerId(value);
  }

  @ViewChild('grid', { static: true }) grid!: UiGridComponent;
  @ViewChild('actionsCell', { static: true }) actionsCell!: TemplateRef<any>;

  readonly columnDefs$ = this._componentStore.columnDefs$;
  readonly dataSource$ = this._componentStore.dataSource$;

  ngOnInit() {
    this._componentStore.setActionCell(this.actionsCell);
  }

  refreshTable() {
    this.grid.refreshTable();
  }

  editCustomerAppointmentModal(appointment: Appointment) {
    this._componentStore.editCustomerAppointmentModal({
      appointment,
      onOk: () => this.grid.refreshTable(),
    });
  }

  deleteCustomerAppointment(id: number) {
    this._componentStore.deleteCustomerAppointment({
      id,
      onComplete: () => this.grid.refreshTable(),
    });
  }
}
