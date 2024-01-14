import { AsyncPipe, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  inject,
} from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { NzCardModule } from 'ng-zorro-antd/card';
import { UiBreadcrumbComponent } from '@shared/components/ui-breadcrumb/ui-breadcrumb.component';
import { LayoutPageContentComponent } from '@shared/layouts/layout-page-content/layout-page-content.component';
import { FormProfileComponent } from '@modules/users/components/form-profile/form-profile.component';
import { FormUserComponent } from '@modules/users/components/form-user/form-user.component';
import { UserInfoComponent } from '@modules/users/components/user-info/user-info.component';
import { PageProfileComponentStore } from './page-profile.component-store';

@Component({
  selector: 'app-page-profile',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    LayoutPageContentComponent,
    UiBreadcrumbComponent,
    FormProfileComponent,
    UserInfoComponent,
    NzCardModule,
    TranslocoModule,
  ],
  templateUrl: './page-profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PageProfileComponentStore],
})
export class PageProfileComponent {
  private _pageUserManageComponentStore = inject(PageProfileComponentStore);

  readonly user$ = this._pageUserManageComponentStore.user$;
}
