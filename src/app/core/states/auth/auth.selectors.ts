import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AUTH_FEATURE_KEY } from '@core/states/auth/auth.reducer';
import { AuthState } from '@core/states/auth/auth.state';

const selectAuthFeature = createFeatureSelector<AuthState>(AUTH_FEATURE_KEY);

export const selectAuthenticating = createSelector(
  selectAuthFeature,
  (state: AuthState) => state.authenticating
);

export const selectUser = createSelector(
  selectAuthFeature,
  (state: AuthState) => state.user
);

export const selectAccessToken = createSelector(
  selectAuthFeature,
  (state: AuthState) => state.accessToken
);

export const selectPermissions = createSelector(
  selectAuthFeature,
  (state: AuthState) => state.permissions
);

export const selectHasPermissions = (
  permissions: string[],
  comparator: 'or' | 'and' = 'or'
) =>
  createSelector(selectAuthFeature, (state: AuthState) => {
    if (!state.permissionsLoaded) return null;

    const intersectCount = [...new Set(state.permissions ?? [])].filter((x) =>
      new Set(permissions).has(x)
    ).length;

    if (comparator == 'or') return intersectCount != 0;
    else return intersectCount == permissions.length;
  });
