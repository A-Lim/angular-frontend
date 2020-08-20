import { Component, OnInit } from '@angular/core';
import { Base } from 'app/shared/components/base.component';

import { UserGroupService } from 'app/modules/usergroups/usergroups.service';
import { UserGroupStatus } from 'app/modules/usergroups/enums/usergroupstatus.enum';
import { AlertService } from 'app/shared/services/alert.service';
import { Title } from '@angular/platform-browser';
import { App } from 'app/configs/app.config';
import { PermissionModule } from 'app/modules/usergroups/models/permissionmodule.model';


@Component({
  selector: 'usergroups-create',
  templateUrl: './usergroups-create.component.html',
  styleUrls: ['./usergroups-create.component.css']
})
export class UserGroupsCreateComponent extends Base implements OnInit {
  permissionModules: PermissionModule[];

  constructor(private userGroupService: UserGroupService) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.setTitle('Create User Group');
    this.userGroupService.getPermissions()
      .subscribe(result => this.permissionModules = result.data);
  }

  onSubmit() {
    // // validate form
    // if (!this.form.valid)
    //   return;

    // this.startLoading();
    // this.userGroupService.createProduct(this.form.value)
    //   .subscribe(response => {
    //     this.alertService.success(response.message);
    //     this.endLoading();
    //   }, _ => {
    //     this.endLoading();
    //   });
  }

}
