import { Route } from '@angular/router';

export const DASHBOARD_ROUTES: Route[] = [
  {
    path: 'dashboard',
    title: 'Dashboard',
    loadComponent: () =>
      import('./pages/page-main-dashboard/page-main-dashboard.component').then(
        (m) => m.PageMainDashboardComponent
      ),
  },
];
