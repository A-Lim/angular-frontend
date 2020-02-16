import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from 'app/modules/auth/login/login.component';
import { RegisterComponent } from 'app/modules/auth/register/register.component';
import { ForgotPasswordComponent } from 'app/modules/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from 'app/modules/auth/reset-password/reset-password.component';
import { GuestGuard } from 'app/core/guards/guest.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [GuestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [GuestGuard] },
  { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [GuestGuard] },
  { path: 'reset-password', component: ResetPasswordComponent, canActivate: [GuestGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
