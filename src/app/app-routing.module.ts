import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuardFn } from '@core/guards/auth.guard';
import { LayoutAdminComponent } from '@shared/layouts/layout-admin/layout-admin.component';
import { AUTH_ROUTES } from '@modules/auth/auth.routes';
import { LayoutAuthComponent } from '@modules/auth/layouts/layout-auth/layout-auth.component';
import { CUSTOMERS_ROUTES } from '@modules/customers/customers.routes';
import { DASHBOARD_ROUTES } from '@modules/dashboard/dashboard.routes';
import { PACKAGES_ROUTES } from '@modules/packages/packages.routes';
import { USER_GROUPS_ROUTES } from '@modules/user-groups/user-groups.routes';
import { USERS_ROUTES } from '@modules/users/users.routes';

const routes: Routes = [
  {
    path: '',
    component: LayoutAuthComponent,
    children: [...AUTH_ROUTES],
  },
  {
    path: 'admin',
    component: LayoutAdminComponent,
    canActivate: [authGuardFn],
    children: [
      ...DASHBOARD_ROUTES,
      ...USERS_ROUTES,
      ...USER_GROUPS_ROUTES,
      ...CUSTOMERS_ROUTES,
      ...PACKAGES_ROUTES,
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { bindToComponentInputs: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
