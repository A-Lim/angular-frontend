import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-layout-page-content',
  standalone: true,
  imports: [],
  templateUrl: './layout-page-content.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutPageContentComponent {}
