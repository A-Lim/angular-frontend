import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { UiBreadcrumbComponent } from '@shared/components/ui-breadcrumb/ui-breadcrumb.component';
import { NoPermissionDirective } from '@shared/directives/no-permission.directive';
import { LayoutPageContentComponent } from '@shared/layouts/layout-page-content/layout-page-content.component';
import { FormUserGroupComponent } from '@modules/user-groups/components/form-user-group/form-user-group.component';
import { TableUserGroupUsersComponent } from '@modules/user-groups/components/table-user-group-users/table-user-group-users.component';
import { PageUserGroupManageComponentStore } from './page-user-group-manage.component-store';

@Component({
  selector: 'app-page-user-group-manage',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    RouterLink,
    NoPermissionDirective,
    LayoutPageContentComponent,
    UiBreadcrumbComponent,
    FormUserGroupComponent,
    TableUserGroupUsersComponent,
    NzAlertModule,
    NzCardModule,
    NzTabsModule,
    TranslocoModule,
  ],
  templateUrl: './page-user-group-manage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PageUserGroupManageComponentStore],
})
export class PageUserGroupManageComponent implements OnInit {
  @Input() id?: number;

  private _pageUserGroupManageComponentStore = inject(PageUserGroupManageComponentStore);
  readonly userGroup$ = this._pageUserGroupManageComponentStore.userGroup$;

  ngOnInit() {
    if (this.id) this._pageUserGroupManageComponentStore.getUserGroup(this.id);
  }
}
