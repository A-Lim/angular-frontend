import { Route } from '@angular/router';

export const USER_GROUPS_ROUTES: Route[] = [
  {
    path: 'user-groups',
    title: 'User Groups',
    loadComponent: () =>
      import('./pages/page-user-groups/page-user-groups.component').then(
        (m) => m.PageUserGroupsComponent
      ),
  },
  {
    path: 'user-groups/:id/edit',
    title: 'Edit User Groups',
    loadComponent: () =>
      import(
        './pages/page-user-group-manage/page-user-group-manage.component'
      ).then((m) => m.PageUserGroupManageComponent),
  },
];
