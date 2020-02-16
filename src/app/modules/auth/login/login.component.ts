import { Component, OnInit, Renderer2 } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { App } from 'app/configs/app.config';
import { PageType } from 'app/shared/models/enums';
import { AuthService } from 'app/core/services/auth.service';
import { AlertService } from 'app/shared/services/alert.service';
import { BaseFormComponent } from 'app/shared/components/baseform.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent extends BaseFormComponent implements OnInit {
  public form: FormGroup;
  public submitted: boolean = false;

  constructor(private titleService: Title, private formBuilder: FormBuilder,
              private router: Router, private alertService: AlertService,
              public renderer: Renderer2, public authService: AuthService) {
    super(renderer);
    this.configureBodyClass(PageType.NoSideMenu);

    // initialize form with validations
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }
  
  ngOnInit() {
    this.titleService.setTitle(`${App.NAME} | Login`);
  }

  onSubmit() {
    super.onSubmit();
    // validate form
    if (!this.form.valid) {
      return;
    }

    const authData = {
      email: this.form.value.email,
      password: this.form.value.password,
      rememberMe: false,
    };

    this.startLoading();
    this.authService.login(authData).subscribe(_ => {
      this.endLoading();
      this.router.navigate(['admin/dashboard']);
    }, _ => {
      this.endLoading();
    });
  }
}
