import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { map } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectUser } from '@core/states/auth/auth.selectors';

export const authGuardFn: CanActivateFn = (
  _: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectUser).pipe(
    map((user) => {
      if (user == undefined) {
        router.navigate(['/'], { queryParams: { returnUrl: state.url } });
        return false;
      }

      if (user.status === 'locked') {
        router.navigate(['admin/locked']);
        return false;
      }

      return true;
    })
  );
};
