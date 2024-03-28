import '@angular/common';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { TranslocoModule } from '@ngneat/transloco';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { SelectUserGroupUsersComponentStore } from './select-user-group-users.component-store';

@Component({
  selector: 'app-select-usergroup-users',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    AsyncPipe,
    FormsModule,
    NzButtonModule,
    NzInputModule,
    NzSelectModule,
    NzToolTipModule,
    IconsProviderModule,
    TranslocoModule,
  ],
  templateUrl: './select-user-group-users.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SelectUserGroupUsersComponentStore],
})
export class SelectUsergroupUsersComponent {
  @Input({ required: true }) set userGroupId(value: number | null | undefined) {
    if (value) {
      this._selectUserGroupUsersComponentStore.setUserGroupId(value);
    }
  }
  @Output() selected = new EventEmitter<number[]>();

  protected ids: number[] = [];

  private _selectUserGroupUsersComponentStore = inject(SelectUserGroupUsersComponentStore);
  readonly loading$ = this._selectUserGroupUsersComponentStore.loading$;
  readonly searching$ = this._selectUserGroupUsersComponentStore.searching$;
  readonly disabled$ = this._selectUserGroupUsersComponentStore.disabled$;
  readonly users$ = this._selectUserGroupUsersComponentStore.users$;

  searchUsers(searchStr: string) {
    this._selectUserGroupUsersComponentStore.searchUsers(searchStr);
  }

  add() {
    this.selected.emit(this.ids);
  }

  clear() {
    this.ids = [];
  }

  loading(isLoading: boolean) {
    this._selectUserGroupUsersComponentStore.setLoading(isLoading);
  }
}
