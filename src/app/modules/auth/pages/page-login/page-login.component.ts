import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { FormLoginComponent } from '@modules/auth/components/form-login/form-login.component';

@Component({
  selector: 'app-page-login',
  standalone: true,
  imports: [TranslocoModule, FormLoginComponent],
  templateUrl: './page-login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageLoginComponent {}
