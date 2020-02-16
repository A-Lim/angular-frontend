import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { User } from 'app/shared/models/user.model';
import { AuthService } from 'app/core/services/auth.service';
import { AlertService } from 'app/shared/services/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  private authListenerSubscriber: Subscription;
  public isAuthenticated = false;
  public user: User;

  constructor(private authService: AuthService, private alertService: AlertService, private router: Router) { }

  ngOnInit() {
    // authListenerSubscriber block might not be initialize first cause synchronous code
    // call checkIsAuthenticated first in case subscriber is not called
    this.isAuthenticated = this.authService.checkIsAuthenticated();
    this.user = this.authService.getUser();
    this.authListenerSubscriber = this.authService
      .getAuthStatusListener()
      .subscribe(data => {
        this.isAuthenticated = data.isAuthenticated;
        this.user = data.user;
      });
  }
  
  onLogout() {
    this.authService.logout().subscribe(response => {
      this.alertService.success(response.message, true);
      this.router.navigate(['login']);
    }, error => {
      this.alertService.error(error);
    });
  }

  ngOnDestroy() {
    this.authListenerSubscriber.unsubscribe();
  }
}
