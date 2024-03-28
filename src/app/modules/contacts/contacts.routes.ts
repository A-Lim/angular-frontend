import { Route } from '@angular/router';

export const CONTACTS_ROUTES: Route[] = [
  {
    path: 'contacts',
    title: 'Contacts',
    loadComponent: () =>
      import('./pages/page-contacts/page-contacts.component').then((m) => m.PageContactsComponent),
  },
];
