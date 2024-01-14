import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-page-main-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page-main-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageMainDashboardComponent {}
