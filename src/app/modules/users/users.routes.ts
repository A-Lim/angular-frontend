import { Route } from '@angular/router';

export const USERS_ROUTES: Route[] = [
  {
    path: 'users',
    title: 'Users',
    loadComponent: () =>
      import('./pages/page-users/page-users.component').then(
        (m) => m.PageUsersComponent
      ),
  },
  {
    path: 'users/:id/edit',
    title: 'Edit User',
    loadComponent: () =>
      import('./pages/page-user-manage/page-user-manage.component').then(
        (m) => m.PageUserManageComponent
      ),
  },
  {
    path: 'profile',
    title: 'Profile',
    loadComponent: () =>
      import('./pages/page-profile/page-profile.component').then(
        (m) => m.PageProfileComponent
      ),
  },
];
