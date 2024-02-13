import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SESSION_FEATURE_KEY, SessionState } from './session.state';

const selectSessionFeature =
  createFeatureSelector<SessionState>(SESSION_FEATURE_KEY);

export const selectSession = <T>(key: keyof SessionState) =>
  createSelector(
    selectSessionFeature,
    (state: SessionState) => state[key] as T | undefined
  );

export const selectSessionExists = (key: keyof SessionState) =>
  createSelector(
    selectSessionFeature,
    (state: SessionState) => state[key] != undefined
  );
