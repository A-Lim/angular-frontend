import { Route } from '@angular/router';

export const PACKAGES_ROUTES: Route[] = [
  {
    path: 'packages',
    title: 'Packages',
    loadComponent: () =>
      import('./pages/page-packages/page-packages.component').then((m) => m.PagePackagesComponent),
  },
];
