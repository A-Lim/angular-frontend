import { NgModule } from '@angular/core';
import {
  DashboardOutline,
  EditOutline,
  FormOutline,
  InboxOutline,
  MenuFoldOutline,
  MenuUnfoldOutline,
  PlusOutline,
  RightOutline,
  UserOutline,
} from '@ant-design/icons-angular/icons';
import { NZ_ICONS, NzIconModule } from 'ng-zorro-antd/icon';

const icons = [
  DashboardOutline,
  EditOutline,
  FormOutline,
  MenuFoldOutline,
  MenuUnfoldOutline,
  PlusOutline,
  RightOutline,
  UserOutline,
  InboxOutline,
];

@NgModule({
  imports: [NzIconModule],
  exports: [NzIconModule],
  providers: [{ provide: NZ_ICONS, useValue: icons }],
})
export class IconsProviderModule {}
