import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BaseFormComponent } from 'app/shared/components/baseform.component';
import { AlertService } from 'app/shared/services/alert.service';
import { User } from 'app/shared/models/user.model';
import ValidationUtil from 'app/shared/helpers/validation.util';
import { AuthService } from 'app/core/services/auth.service';

@Component({
  selector: 'app-profile-general-tab',
  templateUrl: './profile-general-tab.component.html',
  styleUrls: ['./profile-general-tab.component.css']
})
export class ProfileGeneralTabComponent extends BaseFormComponent implements OnInit {
  public user: User;

  constructor(public alertService: AlertService, public authService: AuthService, 
    private formBuilder: FormBuilder) {
    super();

    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      oldPassword: ['', Validators.minLength(8)],
      newPassword: ['', [Validators.minLength(8)]],
      confirmPassword: ['', []]
    }, {
      validator: [
        ValidationUtil.matchValue('newPassword', 'confirmPassword'),
        // if either oldPassword or newPassword is filled, the other will be required
        ValidationUtil.requiredIf('oldPassword', 'newPassword'),
        ValidationUtil.requiredIf('newPassword', 'oldPassword')
      ]
    });
  }

  ngOnInit() {
    this.startLoading();
    this.authService.getProfile().subscribe(response => {
      this.user = response.data;
      this.populateForm();
      this.endLoading();
    }, error => {
      this.endLoading();
    });
  }

  onSubmit() {
    super.onSubmit();
    // validate form
    if (!this.form.valid) {
      return;
    }

    this.startLoading();
    // format form value
    const input = {
      name: this.form.value.name,
      email: this.form.value.email,
      oldPassword: this.form.value.oldPassword,
      newPassword: this.form.value.newPassword,
      newPassword_confirmation: this.form.value.confirmPassword
    }

    this.authService.updateProfile(input).subscribe(response => {
      this.alertService.success(response.message);
      this.user = response.data;
      this.endLoading();
    }, _ => {
      this.endLoading();
    });
  }

  populateForm() {
    this.form.setValue({
      name: this.user.name,
      email: this.user.email,
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  }
}
