import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from 'app/core/guards/auth.guard';
import { UserGroupsListComponent } from 'app/modules/usergroups/usergroups-list/usergroups-list.component';
import { UserGroupsEditComponent } from 'app/modules/usergroups/usergroups-edit/usergroups-edit.component';
import { UserGroupsCreateComponent } from 'app/modules/usergroups/usergroups-create/usergroups-create.component';

const routes: Routes = [
  { path: '', component: UserGroupsListComponent, canActivate: [AuthGuard] },
  { path: 'create', component: UserGroupsEditComponent, canActivate: [AuthGuard] },
  { path: ':id', component: UserGroupsCreateComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserGroupsRoutingModule { }
