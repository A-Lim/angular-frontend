import { createReducer, on } from '@ngrx/store';
import { AuthActions } from '@core/states/auth/auth.actions';
import { AuthState } from '@core/states/auth/auth.state';

export const AUTH_FEATURE_KEY = 'auth';

const AuthInitialState: AuthState = {
  authenticating: false,
  permissionsLoaded: false,
};

export const AUTH_REDUCER = createReducer<AuthState>(
  AuthInitialState,

  on(AuthActions.login, (state) => ({
    ...state,
    error: undefined,
    authenticating: true,
  })),

  on(AuthActions.loginSuccess, (state) => ({
    ...state,
    authenticating: false,
  })),

  on(AuthActions.loginFailure, (state) => ({
    ...state,
    authenticating: false,
  })),

  on(AuthActions.updateAvatar, (state, { avatar }) => {
    const newState = { ...state };

    if (state.user) {
      newState.user = {
        ...state.user,
        avatar,
      };
    }
    return newState;
  }),

  on(AuthActions.updateProfile, (state, { user }) => ({
    ...state,
    user,
  })),

  on(AuthActions.getMyPermissionsSuccess, (state, { permissions }) => ({
    ...state,
    permissionsLoaded: true,
    permissions,
  })),

  on(AuthActions.loadAuthDataSuccess, (state, { user, accessToken, expiresAt }) => ({
    ...state,
    user,
    accessToken,
    expiresAt,
  })),

  on(AuthActions.storeAuthData, (state, { authData }) => ({
    ...state,
    accessToken: authData.accessToken,
    expiresAt: new Date(authData.expiresAt).toJSON(),
    user: authData.user,
  })),

  on(AuthActions.logoutSuccess, () => ({
    ...AuthInitialState,
  }))
);
