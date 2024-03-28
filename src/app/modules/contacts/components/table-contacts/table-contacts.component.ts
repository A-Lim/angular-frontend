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
import { UtilAggridService } from '@shared/services/util-aggrid.service';
import { UtilUrlQueryBuilderService } from '@shared/services/util.urlquerybuilder.service';
import { TableContactsComponentStore } from './table-contacts.component-store';

@Component({
  selector: 'app-table-contacts',
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
  templateUrl: './table-contacts.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TableContactsComponentStore],
})
export class TableContactsComponent implements OnInit {
  @ViewChild('grid', { static: true }) grid!: UiGridComponent;
  @ViewChild('actionsCell', { static: true }) actionsCell!: TemplateRef<any>;

  private _tableContactsComponentStore = inject(TableContactsComponentStore);
  readonly columnDefs$ = this._tableContactsComponentStore.columnDefs$;
  readonly dataSource$ = this._tableContactsComponentStore.dataSource$;

  ngOnInit() {
    this._tableContactsComponentStore.setActionCell(this.actionsCell);
  }

  editContactModal(id: number) {
    this._tableContactsComponentStore.editContactModal({
      id,
      onOk: () => this.grid.refreshTable(),
    });
  }

  deleteContact(id: number) {
    this._tableContactsComponentStore.deleteContact({
      id,
      onComplete: () => this.grid.refreshTable(),
    });
  }
}
