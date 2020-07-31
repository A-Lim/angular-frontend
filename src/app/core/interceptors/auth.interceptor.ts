  
import { HttpRequest, HttpHandler, HttpInterceptor } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'app/core/services/auth.service';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, switchMap, filter, take, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AlertService } from 'app/shared/services/alert.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private router: Router, private authService: AuthService, 
    private alertService: AlertService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const accessToken = this.authService.accessToken;
    const authRequest = this.addToken(req, accessToken);

    return next.handle(authRequest).pipe(
      catchError(error => {
        if (error.status === 401 && error.error.message === 'Unauthenticated.') {
          this.isRefreshing = true;
          this.refreshTokenSubject.next(null);

          return this.refreshToken(req, next);
        }
        return throwError(error);
      })
    );
  }
  
  private refreshToken(req: HttpRequest<any>, next: HttpHandler) {
    return this.authService.refreshAuthToken().pipe(
      switchMap(response => {
        const refreshResponse = response.data;

        this.isRefreshing = false;
        this.refreshTokenSubject.next(refreshResponse.refreshToken);
        return next.handle(this.addToken(req, refreshResponse.accessToken));
      }),
      // error during refresh token
      // clear authdata and redirect to login page
      catchError(error => {
        this.authService.reset();
        this.alertService.error('Session expired.', true);
        this.router.navigate(['login']);
        return throwError(error);
      })
  );
  }

  private addToken(req: HttpRequest<any>, accessToken: string) {
    return req.clone({
      headers: req.headers.set('Authorization', `Bearer ${accessToken}`)
    });
  }
}