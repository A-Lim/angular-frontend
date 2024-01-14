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
import { FormUserComponent } from '@modules/users/components/form-user/form-user.component';
import { UserInfoComponent } from '@modules/users/components/user-info/user-info.component';
import { PageUserManageComponentStore } from './page-user-manage.component-store';

@Component({
  selector: 'app-page-user-manage',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    LayoutPageContentComponent,
    UiBreadcrumbComponent,
    FormUserComponent,
    UserInfoComponent,
    NzCardModule,
    TranslocoModule,
  ],
  templateUrl: './page-user-manage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PageUserManageComponentStore],
})
export class PageUserManageComponent implements OnInit {
  @Input() id?: number;

  private _pageUserManageComponentStore = inject(PageUserManageComponentStore);
  readonly user$ = this._pageUserManageComponentStore.user$;

  ngOnInit() {
    if (this.id) this._pageUserManageComponentStore.getUser(this.id);
  }
}
