import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { 
    path: '', 
    loadChildren: () => import('app/modules/auth/auth.module').then(m => m.AuthModule), 
  },
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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
