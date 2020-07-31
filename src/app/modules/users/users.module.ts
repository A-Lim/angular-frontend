import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';

import { UsersRoutingModule } from 'app/modules/users/users.routing';
import { UsersListComponent } from './users-list/users-list.component';
import { UsersCreateComponent } from './users-create/users-create.component';
import { UsersEditComponent } from './users-edit/users-edit.component';
import { UsersEditGeneralTabComponent } from './users-edit/users-edit-general-tab/users-edit-general-tab.component';
import { Select2Directive } from 'app/shared/directives/select2.directive';

@NgModule({
  declarations: [
    UsersListComponent,
    UsersCreateComponent,
    UsersEditComponent,
    UsersEditGeneralTabComponent,
    Select2Directive
  ],
  imports: [
    UsersRoutingModule,
    SharedModule,
  ],
})
export class UsersModule { }
