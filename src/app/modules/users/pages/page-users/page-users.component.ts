import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { NzCardModule } from 'ng-zorro-antd/card';
import { UiBreadcrumbComponent } from '@shared/components/ui-breadcrumb/ui-breadcrumb.component';
import { LayoutPageContentComponent } from '@shared/layouts/layout-page-content/layout-page-content.component';
import { TableUsersComponent } from '@modules/users/components/table-users/table-users.component';

@Component({
  selector: 'app-page-users',
  standalone: true,
  imports: [
    LayoutPageContentComponent,
    UiBreadcrumbComponent,
    TableUsersComponent,
    NzCardModule,
    TranslocoModule,
  ],
  templateUrl: './page-users.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageUsersComponent {}
