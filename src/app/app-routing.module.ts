import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminLayoutComponent } from 'app/shared/components/layouts/admin/admin.layout.component';
import { DefaultLayoutComponent } from './shared/components/layouts/default.layout.component.css/default.layout.component';

const routes: Routes = [
  { 
    path: '', 
    component: DefaultLayoutComponent,
    loadChildren: () => import('app/modules/auth/auth.module').then(m => m.AuthModule), 
  },
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { 
        path: 'admin/dashboard', 
        data: { breadcrumb: 'dashboard', module: 'dashboard' },
        loadChildren: () => import('app/modules/dashboard/dashboard.module').then(m => m.DashboardModule), 
      },
      { 
        path: 'admin/profile', 
        data: { breadcrumb: 'profile', module: 'profile' },
        loadChildren: () => import('app/modules/profile/profile.module').then(m => m.ProfileModule), 
      },
      { 
        path: 'admin/systemsettings', 
        data: { breadcrumb: 'system settings', module: 'system settings' },
        loadChildren: () => import('app/modules/systemsettings/systemsettings.module').then(m => m.SystemSettingsModule), 
      },
      { 
        path: 'admin/users', 
        data: { breadcrumb: 'users', module: 'users' },
        loadChildren: () => import('app/modules/users/users.module').then(m => m.UsersModule), 
      },
      { 
        path: 'admin/usergroups', 
        data: { breadcrumb: 'user groups', module: 'user groups' },
        loadChildren: () => import('app/modules/usergroups/usergroups.module').then(m => m.UserGroupsModule), 
      },
      { 
        path: 'admin/products', 
        data: { breadcrumb: 'products', module: 'products' },
        loadChildren: () => import('app/modules/products/products.module').then(m => m.ProductsModule), 
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
