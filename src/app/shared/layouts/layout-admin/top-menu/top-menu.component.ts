import { AsyncPipe, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslocoModule } from '@ngneat/transloco';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { AuthActions } from '@core/states/auth/auth.actions';
import { selectUser } from '@core/states/auth/auth.selectors';

@Component({
  selector: 'app-top-menu',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    RouterLink,
    NzAvatarModule,
    NzDropDownModule,
    NzLayoutModule,
    NzIconModule,
    TranslocoModule,
  ],
  templateUrl: './top-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopMenuComponent {
  @Input() isCollapsed: boolean = false;
  @Output() toggle = new EventEmitter();

  private _store = inject(Store);
  readonly user$ = this._store.select(selectUser);

  logout() {
    this._store.dispatch(AuthActions.logout());
  }
}
