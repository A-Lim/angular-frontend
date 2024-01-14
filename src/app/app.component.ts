import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthActions } from '@core/state/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  private readonly _store = inject(Store);
  isCollapsed = false;

  ngOnInit() {
    this._store.dispatch(AuthActions.loadAuthData());
  }
}
