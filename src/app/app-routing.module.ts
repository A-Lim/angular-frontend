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
        loadChildren: () => import('app/modules/dashboard/dashboard.module').then(m => m.DashboardModule), 
      },
      { 
        path: 'admin/profile', 
        loadChildren: () => import('app/modules/profile/profile.module').then(m => m.ProfileModule), 
      },
      { 
        path: 'admin/systemsettings', 
        loadChildren: () => import('app/modules/systemsettings/systemsettings.module').then(m => m.SystemSettingsModule), 
      },
      { 
        path: 'admin/users', 
        loadChildren: () => import('app/modules/users/users.module').then(m => m.UsersModule), 
      },
      { 
        path: 'admin/usergroups', 
        loadChildren: () => import('app/modules/usergroups/usergroups.module').then(m => m.UserGroupsModule), 
      },
      { 
        path: 'admin/products', 
        loadChildren: () => import('app/modules/products/products.module').then(m => m.ProductsModule), 
      },
      { 
        path: 'admin/orders', 
        loadChildren: () => import('app/modules/orders/orders.module').then(m => m.OrdersModule), 
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
