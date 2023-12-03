import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormLoginComponent } from '../../components/form-login/form-login.component';

@Component({
  selector: 'app-page-login',
  standalone: true,
  imports: [FormLoginComponent],
  templateUrl: './page-login.component.html',
  styleUrls: ['./page-login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageLoginComponent {}
