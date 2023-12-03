import { Route } from '@angular/router';
import { LayoutAuthComponent } from './layouts/layout-auth/layout-auth.component';

export const AUTH_ROUTES: Route[] = [
  {
    path: '',
    component: LayoutAuthComponent,
    children: [
      {
        path: 'login',
        title: 'Login',
        loadComponent: () =>
          import('./pages/page-login/page-login.component').then(
            (m) => m.PageLoginComponent
          ),
      },
    ],
  },
];
