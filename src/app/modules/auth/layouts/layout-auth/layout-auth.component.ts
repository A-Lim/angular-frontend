import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { PageLoginComponent } from '../../pages/page-login/page-login.component';

@Component({
  selector: 'app-layout-auth',
  standalone: true,
  imports: [RouterOutlet, NzCardModule, PageLoginComponent],
  templateUrl: './layout-auth.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutAuthComponent {}
