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
import { Package } from '@modules/packages/models/package.model';
import { TablePackagesComponentStore } from './table-packages.component-store';

@Component({
  selector: 'app-table-packages',
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
  templateUrl: './table-packages.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TablePackagesComponentStore],
})
export class TablePackagesComponent implements OnInit {
  @ViewChild('grid', { static: true }) grid!: UiGridComponent;
  @ViewChild('actionsCell', { static: true }) actionsCell!: TemplateRef<any>;

  private _tablePackagesComponentStore = inject(TablePackagesComponentStore);
  readonly columnDefs$ = this._tablePackagesComponentStore.columnDefs$;
  readonly dataSource$ = this._tablePackagesComponentStore.dataSource$;

  ngOnInit() {
    this._tablePackagesComponentStore.setActionCell(this.actionsCell);
  }

  editPackageModal(pckage: Package) {
    this._tablePackagesComponentStore.editPackageModal({
      pckage,
      onOk: () => this.grid.refreshTable(),
    });
  }

  deletePackage(id: number) {
    this._tablePackagesComponentStore.deletePackage({
      id,
      onComplete: () => this.grid.refreshTable(),
    });
  }
}
