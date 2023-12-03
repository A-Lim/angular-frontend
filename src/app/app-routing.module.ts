import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AUTH_ROUTES } from './modules/auth/auth.routes';

const routes: Routes = [
  ...AUTH_ROUTES,
  // { path: '', pathMatch: 'full', redirectTo: '/welcome' },
  // { path: 'welcome', loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomeModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
