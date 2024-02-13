import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { UiBreadcrumbComponent } from '@shared/components/ui-breadcrumb/ui-breadcrumb.component';
import { LayoutPageContentComponent } from '@shared/layouts/layout-page-content/layout-page-content.component';
import { TableUserGroupsComponent } from '@modules/user-groups/components/table-user-groups/table-user-groups.component';

@Component({
  selector: 'app-page-user-groups',
  standalone: true,
  imports: [
    RouterModule,
    LayoutPageContentComponent,
    UiBreadcrumbComponent,
    TableUserGroupsComponent,
    NzButtonModule,
    NzCardModule,
    TranslocoModule,
  ],
  templateUrl: './page-user-groups.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageUserGroupsComponent {}
