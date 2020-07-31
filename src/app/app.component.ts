import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { AuthService } from './core/services/auth.service';

import { Router } from '@angular/router';
import { App } from './configs/app.config';
import { User } from './shared/models/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = App.NAME;

  public isAuthenticated$: Observable<boolean>;
  public user$: Observable<User>;

  constructor(private authService: AuthService, public router: Router) {
  }

  ngOnInit() {
    this.authService.autoAuthUser();
    this.isAuthenticated$ = this.authService.isAuthenticated$;
    this.user$ = this.authService.user$;
  }

  ngOnDestroy() {
  }
}
