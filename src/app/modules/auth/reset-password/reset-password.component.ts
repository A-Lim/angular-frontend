import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FormBuilder, Validators } from '@angular/forms';

import { PageType } from 'app/shared/models/enums';
import { App } from 'app/configs/app.config';
import { AuthService } from 'app/core/services/auth.service';
import { AlertService } from 'app/shared/services/alert.service';
import { BaseFormComponent } from 'app/shared/components/baseform.component';
import ValidationUtil from 'app/shared/helpers/validation.util';

@Component({
  selector: 'auth-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent extends BaseFormComponent implements OnInit {
  public email: string;
  public token: string;

  constructor(private titleService: Title, private formBuilder: FormBuilder, 
              private route: ActivatedRoute, private alertService: AlertService,
              public authService: AuthService) {
    super();
  }

  ngOnInit() {
    this.initForm();
    this.titleService.setTitle(`${App.NAME} | Reset Password`);

    this.token = this.route.snapshot.queryParamMap.get('token');
    this.email = this.route.snapshot.queryParamMap.get('email');
    
    if (this.token === null || this.token === "" ||
        this.email === null || this.email === "") {
      this.form.disable();
      this.alertService.error("Invalid link");
    }
  }

  initForm() {
    this.form = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', []]
    }, {
      validator: ValidationUtil.matchValue('password', 'confirmPassword')
    });
  }

  onSubmit() {
    super.onSubmit();
    // validate form
    if (!this.form.valid) {
      return;
    }

    this.startLoading();
    const data = {
      token: this.token,
      email: this.email,
      password: this.f.password.value,
      password_confirmation: this.f.confirmPassword.value
    }
    this.authService.resetPassword(data).subscribe(response => {
      if (response.message) {
        this.alertService.success(response.message);
      }
      this.submitted = false;
      this.form.reset();
      this.endLoading();
    }, _ => {
      this.endLoading();
    });
  }
}
