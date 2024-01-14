import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-table-usergroup-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-usergroup-users.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableUsergroupUsersComponent {}
