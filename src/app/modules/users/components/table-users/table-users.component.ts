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
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { UiGridComponent } from '@shared/components/ui-grid/ui-grid.component';
import { UiTemplateRendererComponent } from '@shared/components/ui-template-renderer/ui-template-renderer.component';
import { UtilAggridService } from '@shared/services/util-aggrid.service';
import { UtilUrlQueryBuilderService } from '@shared/services/util.urlquerybuilder.service';
import { TableUsersComponentStore } from './table-users.component-store';

@Component({
  selector: 'app-table-users',
  standalone: true,
  imports: [
    NgIf,
    NgSwitch,
    NgSwitchCase,
    AsyncPipe,
    TitleCasePipe,
    RouterLink,
    UiGridComponent,
    UiTemplateRendererComponent,
    NzTagModule,
    NzButtonModule,
    NzToolTipModule,
    NzIconModule,
    TranslocoModule,
  ],
  templateUrl: './table-users.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TableUsersComponentStore],
})
export class TableUsersComponent implements OnInit {
  @ViewChild('actionsCell', { static: true }) actionsCell!: TemplateRef<any>;
  @ViewChild('statusCell', { static: true }) statusCell!: TemplateRef<any>;

  private _tableUsersComponentStore = inject(TableUsersComponentStore);
  readonly columnDefs$ = this._tableUsersComponentStore.columnDefs$;
  readonly dataSource$ = this._tableUsersComponentStore.dataSource$;

  ngOnInit() {
    this._tableUsersComponentStore.setActionCell(this.actionsCell);
    this._tableUsersComponentStore.setStatusCell(this.statusCell);
  }
}
