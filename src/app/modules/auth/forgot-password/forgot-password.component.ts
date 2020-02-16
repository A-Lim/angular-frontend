import { Component, OnInit, Renderer2 } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormBuilder, Validators } from '@angular/forms';

import { App } from 'app/configs/app.config';
import { BaseFormComponent } from 'app/shared/components/baseform.component';
import { AlertService } from 'app/shared/services/alert.service';
import { AuthService } from 'app/core/services/auth.service';
import { PageType } from 'app/shared/models/enums';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent extends BaseFormComponent implements OnInit {

  constructor(private titleService: Title, private formBuilder: FormBuilder, 
              private authService: AuthService, private alertService: AlertService,
              public renderer: Renderer2) { 
    super(renderer);
    this.configureBodyClass(PageType.NoSideMenu);

    // initialize form with validations
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit() {
    this.titleService.setTitle(`${App.NAME} | Forgot Password`);
  }

  onSubmit() {
    super.onSubmit();
    // validate form
    if (!this.form.valid) {
      return;
    }

    this.startLoading();
    this.authService.forgotPassword(this.form.value).subscribe(response => {
      this.alertService.success(response.message);
      this.endLoading();
    }, _ => {
      this.endLoading();
    });
  }
}
