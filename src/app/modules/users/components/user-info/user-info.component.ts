import {
  AsyncPipe,
  NgClass,
  NgIf,
  NgSwitch,
  NgSwitchCase,
  TitleCasePipe,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { User } from '@core/models/user.model';
import { UserInfoComponentStore } from './user-info.component-store';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    NgClass,
    NgSwitch,
    NgSwitchCase,
    TitleCasePipe,
    NzAvatarModule,
    NzTagModule,
    TranslocoModule,
    NzIconModule,
  ],
  templateUrl: './user-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UserInfoComponentStore],
})
export class UserInfoComponent implements OnChanges {
  @Input() user?: User | null;

  private _userInfoComponentStore = inject(UserInfoComponentStore);

  readonly loading$ = this._userInfoComponentStore.loading$;
  readonly avatar$ = this._userInfoComponentStore.avatar$;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['user']) {
      this._userInfoComponentStore.setUser(this.user);
    }
  }

  uploadAvatar(event: Event) {
    this._userInfoComponentStore.uploadAvatar(event);
  }
}
