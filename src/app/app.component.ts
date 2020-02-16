import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'angular-frontend';
  public isAuthenticated = false;
  public user: object;
  private authListenerSubscriber: Subscription;

  constructor(private authService: AuthService, public router: Router) {
  }

  ngOnInit() {
    this.authService.autoAuthUser();
    this.isAuthenticated = this.authService.checkIsAuthenticated();
    this.authListenerSubscriber = this.authService
      .getAuthStatusListener()
      .subscribe(data => {
        this.isAuthenticated = data.isAuthenticated;
        this.user = data.user;
      });
  }

  ngOnDestroy() {
    this.authListenerSubscriber.unsubscribe();
  }
}
