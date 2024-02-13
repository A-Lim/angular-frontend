import { AsyncPipe, NgFor, NgIf, NgSwitch, NgSwitchCase, TitleCasePipe } from '@angular/common';
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
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { UiGridComponent } from '@shared/components/ui-grid/ui-grid.component';
import { HasPermissionDirective } from '@shared/directives/has-permission.directive';
import { UserGroup } from '@modules/user-groups/models/usergroup.model';
import { SelectUsergroupUsersComponent } from '../select-user-group-users/select-user-group-users.component';
import { TableUserGroupUsersComponentStore } from './table-user-group-users.component-store';

@Component({
  selector: 'app-table-user-group-users',
  standalone: true,
  imports: [
    AsyncPipe,
    TitleCasePipe,
    NgIf,
    NgFor,
    NgSwitch,
    NgSwitchCase,
    RouterLink,
    HasPermissionDirective,
    NzGridModule,
    NzIconModule,
    NzButtonModule,
    NzTagModule,
    NzModalModule,
    NzToolTipModule,
    TranslocoModule,
    UiGridComponent,
    SelectUsergroupUsersComponent,
  ],
  templateUrl: './table-user-group-users.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TableUserGroupUsersComponentStore, NzModalService],
})
export class TableUserGroupUsersComponent implements OnInit {
  @ViewChild('select', { static: true }) select!: SelectUsergroupUsersComponent;
  @ViewChild('grid', { static: true }) grid!: UiGridComponent;
  @ViewChild('actionsCell', { static: true }) actionsCell!: TemplateRef<any>;
  @ViewChild('statusCell', { static: true }) statusCell!: TemplateRef<any>;

  @Input() set userGroup(value: UserGroup | undefined | null) {
    this._tableUserGroupUsersComponentStore.setUserGroup(value);
  }

  private _tableUserGroupUsersComponentStore = inject(TableUserGroupUsersComponentStore);

  readonly searching$ = this._tableUserGroupUsersComponentStore.searching$;
  readonly userGroupId$ = this._tableUserGroupUsersComponentStore.userGroupId$;
  readonly users$ = this._tableUserGroupUsersComponentStore.users$;
  readonly dataSource$ = this._tableUserGroupUsersComponentStore.dataSource$;
  readonly columnDefs$ = this._tableUserGroupUsersComponentStore.columnDefs$;

  ngOnInit() {
    this._tableUserGroupUsersComponentStore.setActionCell(this.actionsCell);
    this._tableUserGroupUsersComponentStore.setStatusCell(this.statusCell);
  }

  onSearch(searchStr: string) {
    this._tableUserGroupUsersComponentStore.searchUser(searchStr);
  }

  addUsers(userIds: number[]) {
    this._tableUserGroupUsersComponentStore.addUsers({
      userIds,
      onStart: () => this.select.loading(true),
      onComplete: () => {
        this.select.clear();
        this.select.loading(false);
        this.grid.refreshTable();
      },
    });
  }

  removeUser(id: number) {
    this._tableUserGroupUsersComponentStore.removeUser({
      id,
      onComplete: () => this.grid.refreshTable(),
    });
  }
}
