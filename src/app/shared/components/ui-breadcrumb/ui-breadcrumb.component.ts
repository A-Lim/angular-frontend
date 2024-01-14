import { NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Breadcrumb } from '@shared/models/breadcrumb.model';

@Component({
  selector: 'app-ui-breadcrumb',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    TitleCasePipe,
    RouterModule,
    NzBreadCrumbModule,
    NzDividerModule,
    NzIconModule,
  ],
  templateUrl: './ui-breadcrumb.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiBreadcrumbComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) breadcrumbs!: Breadcrumb[];
}
