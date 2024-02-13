import { Injectable, inject } from '@angular/core';
import { environment } from '@environments/environment';
import { filter, map, mergeMap, tap } from 'rxjs';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { SessionActions } from '@core/states/session/session.actions';
import { SessionApiService } from '@core/states/session/session.api-service';
import { selectSessionExists } from '@core/states/session/session.selectors';
import {
  SessionState,
  SessionStateKeys,
} from '@core/states/session/session.state';

@Injectable()
export class SessionEffects {
  private _store = inject(Store);
  private _actions$ = inject(Actions);
  private _sessionDataApiService = inject(SessionApiService);
  private SESSION_STORAGE_KEY = environment.name.replace(' ', '');

  readonly getSession$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(SessionActions.getSession),
      map(() => {
        const session = <SessionState>{};
        SessionStateKeys.forEach((key) => {
          const data = JSON.parse(
            localStorage.getItem(`${this.SESSION_STORAGE_KEY}:${key}`) ?? 'null'
          );

          session[key] = data;
        });

        return SessionActions.setSession({ data: session });
      })
    );
  });

  readonly clearSession$ = createEffect(
    () => {
      return this._actions$.pipe(
        ofType(SessionActions.clearSession),
        tap(() => {
          SessionStateKeys.forEach((key) =>
            localStorage.removeItem(`${this.SESSION_STORAGE_KEY}:${key}`)
          );
        })
      );
    },
    { dispatch: false }
  );

  readonly getResource$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(SessionActions.getResource),
      concatLatestFrom(({ key }) =>
        this._store.select(selectSessionExists(key))
      ),
      // check if resource already exists in store
      filter(([, exists]) => !exists),
      // if not then call api to retrieve it and save it
      mergeMap(([{ key, params }]) =>
        this._sessionDataApiService
          .getResource(key, params)
          .pipe(
            map((resource) =>
              SessionActions.saveSessionData({ key, value: resource })
            )
          )
      )
    );
  });

  readonly saveSessionData$ = createEffect(
    () => {
      return this._actions$.pipe(
        ofType(SessionActions.saveSessionData),
        tap(({ key, value }) =>
          localStorage.setItem(
            `${this.SESSION_STORAGE_KEY}:${key}`,
            JSON.stringify(value)
          )
        )
      );
    },
    { dispatch: false }
  );
}
