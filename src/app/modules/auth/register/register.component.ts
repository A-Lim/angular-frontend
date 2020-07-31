import { Component, OnInit, Renderer2 } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormBuilder, Validators } from '@angular/forms';

import { AlertService } from 'app/shared/services/alert.service';
import { AuthService } from 'app/core/services/auth.service';
import { BaseFormComponent } from 'app/shared/components/baseform.component';
import { App } from 'app/configs/app.config';
import ValidationUtil from 'app/shared/helpers/validation.util';


@Component({
  selector: 'auth-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent extends BaseFormComponent implements OnInit {

  constructor(private titleService: Title, private formBuilder: FormBuilder, 
              private alertService: AlertService, public authService: AuthService) {
    super();
  }

  ngOnInit() {
    this.initForm();
    this.titleService.setTitle(`${App.NAME} | Register`);
  }

  initForm() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
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
    // format form value
    const input = {
      name: this.form.value.name,
      email: this.form.value.email,
      password: this.form.value.password,
      password_confirmation: this.form.value.confirmPassword
    }

    this.authService.register(input).subscribe(response => {
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
