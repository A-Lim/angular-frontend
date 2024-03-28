import { Route } from '@angular/router';

export const CUSTOMERS_ROUTES: Route[] = [
  {
    path: 'customers',
    title: 'Customers',
    loadComponent: () =>
      import('./pages/page-customers/page-customers.component').then(
        (m) => m.PageCustomersComponent
      ),
  },
];
