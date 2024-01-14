import {
  AsyncPipe,
  NgIf,
  NgSwitch,
  NgSwitchCase,
  TitleCasePipe,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  inject,
} from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { UiGridComponent } from '@shared/components/ui-grid/ui-grid.component';
import { UiTemplateRendererComponent } from '@shared/components/ui-template-renderer/ui-template-renderer.component';
import { UtilAggridService } from '@shared/services/util-aggrid.service';
import { UtilUrlQueryBuilderService } from '@shared/services/util.urlquerybuilder.service';
import { TableUserGroupsComponentStore } from './table-user-groups.component-store';

@Component({
  selector: 'app-table-user-groups',
  standalone: true,
  imports: [
    NgIf,
    NgSwitch,
    NgSwitchCase,
    AsyncPipe,
    TitleCasePipe,
    UiGridComponent,
    UiTemplateRendererComponent,
    NzTagModule,
    NzButtonModule,
    NzToolTipModule,
    NzIconModule,
    TranslocoModule,
  ],
  templateUrl: './table-user-groups.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TableUserGroupsComponentStore,
    UtilAggridService,
    UtilUrlQueryBuilderService,
  ],
})
export class TableUserGroupsComponent implements OnInit {
  @ViewChild('phoneCell', { static: true }) phoneCell!: TemplateRef<any>;
  @ViewChild('actionsCell', { static: true }) actionsCell!: TemplateRef<any>;
  @ViewChild('statusCell', { static: true }) statusCell!: TemplateRef<any>;

  private _tableUserGroupsComponentStore = inject(
    TableUserGroupsComponentStore
  );
  readonly columnDefs$ = this._tableUserGroupsComponentStore.columnDef$;
  readonly dataSourceCallback$ =
    this._tableUserGroupsComponentStore.dataSourceCallback$;

  ngOnInit() {
    this._tableUserGroupsComponentStore.setActionCell(this.actionsCell);
    this._tableUserGroupsComponentStore.setStatusCell(this.statusCell);
  }

  navigateTo(route: string) {
    this._tableUserGroupsComponentStore.navigateTo(route);
  }
}
