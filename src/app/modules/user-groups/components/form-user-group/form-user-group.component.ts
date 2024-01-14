import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-form-user-group',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-user-group.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormUserGroupComponent {}
