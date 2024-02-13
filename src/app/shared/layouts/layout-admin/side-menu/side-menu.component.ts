import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { HasPermissionDirective } from '@shared/directives/has-permission.directive';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [RouterLink, HasPermissionDirective, NzMenuModule, NzIconModule, TranslocoModule],
  templateUrl: './side-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideMenuComponent {
  @Input() isCollapsed: boolean = false;
}
