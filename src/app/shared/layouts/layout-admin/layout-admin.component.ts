import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '@environments/environment';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { TopMenuComponent } from './top-menu/top-menu.component';

@Component({
  selector: 'app-layout-admin',
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    RouterOutlet,
    SideMenuComponent,
    TopMenuComponent,
    NzLayoutModule,
  ],
  templateUrl: './layout-admin.component.html',
  styleUrls: ['./layout-admin.component.scss'],
})
export class LayoutAdminComponent {
  readonly appName = environment.name;
  isCollapsed = false;
}
