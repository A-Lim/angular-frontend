import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { filter, map } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectHasPermissions } from '@core/state/auth.selectors';

export const permissionGuardFn: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  _: RouterStateSnapshot
) => {
  const store = inject(Store);
  const router = inject(Router);

  const permissions = route.data['permissions'];
  const condition = route.data['condition'] ?? 'or';

  return store.select(selectHasPermissions(permissions, condition)).pipe(
    filter((x) => x != null),
    map((isAuthorized) =>
      isAuthorized ? true : router.parseUrl('/admin/unauthorized')
    )
  );
};
