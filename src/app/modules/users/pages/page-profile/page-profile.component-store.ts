import { Injectable, inject } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { selectUser } from '@core/states/auth/auth.selectors';

@Injectable()
export class PageProfileComponentStore extends ComponentStore<object> {
  private _store = inject(Store);

  // #region SELECTORS
  readonly user$ = this._store.select(selectUser);
  // #endRegion

  // #region REDUCERS
  // #endRegion

  // #region EFFECTS
  // #endregion
}
