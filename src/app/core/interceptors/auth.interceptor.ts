import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError, switchMap, take, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AuthActions } from '@core/states/auth/auth.actions';
import { selectAccessToken } from '@core/states/auth/auth.selectors';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private store: Store, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (req.headers.has('X-Skip-Interceptor')) {
      const headers = req.headers.delete('X-Skip-Interceptor');
      return next.handle(req.clone({ headers }));
    }

    return this.store.select(selectAccessToken).pipe(
      take(1),
      switchMap((accessToken) => {
        if (!accessToken) {
          return next.handle(req).pipe(tap(() => this.router.navigate(['/'])));
        }

        const authRequest = this.addToken(req, accessToken);
        return next.handle(authRequest).pipe(
          catchError((error) => {
            if (
              error.status === 401 &&
              error.error.message === 'Unauthenticated.'
            ) {
              this.store.dispatch(AuthActions.clearAuthData());
              this.router.navigate(['/']);
            }

            return throwError(() => error);
          })
        );
      })
    );
  }

  private addToken(req: HttpRequest<any>, accessToken: string) {
    return req.clone({
      headers: req.headers.set('Authorization', `Bearer ${accessToken}`),
    });
  }
}
