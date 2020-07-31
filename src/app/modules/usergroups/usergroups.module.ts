import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';

import { UserGroupsRoutingModule } from 'app/modules/usergroups/usergroups.routing';
import { UserGroupsListComponent } from 'app/modules/usergroups/usergroups-list/usergroups-list.component';
import { UserGroupsEditComponent } from 'app/modules/usergroups/usergroups-edit/usergroups-edit.component';
import { UserGroupsCreateComponent } from 'app/modules/usergroups/usergroups-create/usergroups-create.component';

@NgModule({
  declarations: [
    UserGroupsListComponent,
    UserGroupsEditComponent,
    UserGroupsCreateComponent
  ],
  imports: [
    UserGroupsRoutingModule,
    SharedModule,
  ],
})
export class UserGroupsModule { }
