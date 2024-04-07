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
  {
    path: 'customers/:id/edit',
    title: 'Edit Customer',
    loadComponent: () =>
      import('./pages/page-customer-manage/page-customer-manage.component').then(
        (m) => m.PageCustomerManageComponent
      ),
  },
];
