import { Route } from '@angular/router';

export const AUTH_ROUTES: Route[] = [
  {
    path: '',
    title: 'Login',
    loadComponent: () =>
      import('./pages/page-login/page-login.component').then(
        (m) => m.PageLoginComponent
      ),
  },
  {
    path: 'reset-password',
    title: 'Reset Password',
    loadComponent: () =>
      import('./pages/page-login/page-login.component').then(
        (m) => m.PageLoginComponent
      ),
  },
];
