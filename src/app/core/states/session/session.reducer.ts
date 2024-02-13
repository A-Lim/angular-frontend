import { createReducer, on } from '@ngrx/store';
import { SessionActions } from './session.actions';
import { SessionState } from './session.state';

export const SessionInitialState: SessionState = {};

export const SESSION_REDUCER = createReducer(
  SessionInitialState,
  on(SessionActions.setSession, (_, action): SessionState => action.data),
  on(
    SessionActions.saveSessionData,
    (state, action): SessionState => ({
      ...state,
      [action.key]: action.value,
    })
  ),
  on(SessionActions.clearSession, (): SessionState => SessionInitialState)
);
