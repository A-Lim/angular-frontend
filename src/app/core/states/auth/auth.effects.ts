import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/component-store';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AuthApiService } from '@core/services/auth.api-service';
import { AuthActions } from '@core/states/auth/auth.actions';
import { PermissionApiService } from '@shared/services/permissions.api-service';
import { selectUser } from './auth.selectors';

@Injectable({ providedIn: 'root' })
export class AuthEffects {
  private _store = inject(Store);
  private _actions$ = inject(Actions);
  private _router = inject(Router);
  private _authApiService = inject(AuthApiService);
  private _permissionsApiService = inject(PermissionApiService);

  readonly login$ = createEffect(() =>
    this._actions$.pipe(
      ofType(AuthActions.login),
      switchMap((data) =>
        this._authApiService.login({ email: data.email, password: data.password }).pipe(
          map((response) => AuthActions.loginSuccess({ authData: response.data })),
          catchError((error) => of(AuthActions.loginFailure(error.error.message)))
        )
      )
    )
  );

  readonly loginSuccess$ = createEffect(() =>
    this._actions$.pipe(
      ofType(AuthActions.loginSuccess),
      tap(() => this._router.navigate(['admin/dashboard'])),
      map((data) => AuthActions.storeAuthData({ authData: data.authData }))
    )
  );

  readonly getMyPermissions$ = createEffect(() =>
    this._actions$.pipe(
      ofType(AuthActions.getMyPermissions),
      switchMap(() =>
        this._permissionsApiService
          .getMyPermissions()
          .pipe(
            map((response) => AuthActions.getMyPermissionsSuccess({ permissions: response.data }))
          )
      )
    )
  );

  readonly logout$ = createEffect(() =>
    this._actions$.pipe(
      ofType(AuthActions.logout),
      switchMap((data) =>
        this._authApiService.logout().pipe(map(() => AuthActions.logoutSuccess()))
      )
    )
  );

  readonly logoutSuccess$ = createEffect(
    () =>
      this._actions$.pipe(
        ofType(AuthActions.logoutSuccess),
        tap(() => {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('expiresAt');
          localStorage.removeItem('user');
          this._router.navigate(['/']);
        })
      ),
    { dispatch: false }
  );

  readonly updateProfilePic$ = createEffect(
    () =>
      this._actions$.pipe(
        ofType(AuthActions.updateAvatar),
        concatLatestFrom(() => this._store.select(selectUser)),
        tap(([, user]) => {
          localStorage.setItem('user', JSON.stringify(user));
        })
      ),
    { dispatch: false }
  );

  readonly storeAuthData$ = createEffect(() =>
    this._actions$.pipe(
      ofType(AuthActions.storeAuthData),
      tap(({ authData }) => {
        localStorage.setItem('accessToken', authData.accessToken);
        localStorage.setItem('expiresAt', authData.expiresAt);
        localStorage.setItem('user', JSON.stringify(authData.user));
      }),
      map(() => AuthActions.getMyPermissions())
    )
  );

  readonly loadAuthData$ = createEffect(() =>
    this._actions$.pipe(
      ofType(AuthActions.loadAuthData),
      map(() => {
        const accessToken = localStorage.getItem('accessToken');
        const expiresAt = localStorage.getItem('expiresAt');
        const user = JSON.parse(localStorage.getItem('user') ?? '{}');

        const expireDate = expiresAt ? new Date(expiresAt) : null;

        if (expiresAt && expireDate) {
          const currentDate = new Date();
          if (currentDate < expireDate && accessToken) {
            return AuthActions.loadAuthDataSuccess({
              user,
              accessToken,
              expiresAt,
            });
          }
        }

        return AuthActions.loadAuthDataFailure();
      })
    )
  );

  readonly loadAuthDataSuccess$ = createEffect(() =>
    this._actions$.pipe(
      ofType(AuthActions.loadAuthDataSuccess),
      map(() => AuthActions.getMyPermissions())
    )
  );
}
