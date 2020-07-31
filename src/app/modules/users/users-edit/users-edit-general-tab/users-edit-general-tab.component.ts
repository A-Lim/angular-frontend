import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from "@angular/router";
import { map } from 'rxjs/operators';

import { User } from 'app/shared/models/user.model';
import { UserGroup } from 'app/shared/models/usergroup.model';
import { AlertService } from 'app/shared/services/alert.service';
import { UserService } from 'app/modules/users/users.service';
import { BaseFormComponent } from 'app/shared/components/baseform.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'users-edit-general-tab',
  templateUrl: './users-edit-general-tab.component.html',
  styleUrls: ['./users-edit-general-tab.component.css']
})
export class UsersEditGeneralTabComponent extends BaseFormComponent implements OnInit {
  public user: User;
  public usergroups: UserGroup[];

  constructor(public alertService: AlertService, public userService: UserService,
    private formBuilder: FormBuilder, private route: ActivatedRoute) {
    super();

    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      status: ['', [Validators.required]],
      usergroups: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.startLoading();
    // (+) operator converts string to number
    const id = +this.route.snapshot.paramMap.get('id');
    const userReq = this.userService.getUser(id);
    const userGroupReq = this.userService.getUserGroups();

    forkJoin([userReq, userGroupReq])
      .subscribe(results => {
        this.user = results[0].data;
        this.usergroups = results[1].data;

        // this.form.patchValue(this.user);
        this.form.patchValue({
          name: this.user.name,
          email: this.user.email,
          status: this.user.status,
          usergroups: this.user.usergroups.map(x => x.id)
        });
        this.endLoading();
      });
  }

  onSubmit() {
    super.onSubmit();
    // validate form
    if (!this.form.valid)
      return;

    // this.startLoading();
    // console.log(this.form.value);
    this.userService.updateUser(this.user.id, this.form.value)
      .subscribe(response => {
        this.alertService.success(response.message);
        this.user = response.data;
        this.endLoading();
      }, _ => {
        this.endLoading();
    });
  }
}
