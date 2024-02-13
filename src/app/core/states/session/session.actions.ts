import { Dictionary } from '@ngrx/entity';
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { SessionState } from './session.state';

export const SessionActions = createActionGroup({
  source: 'Session',
  events: {
    'Get Session': emptyProps(),
    'Set Session': props<{ data: SessionState }>(),
    'Save Session Data': props<{ key: keyof SessionState; value: any }>(),
    'Clear Session': emptyProps(),
    'Get Resource': props<{
      key: keyof SessionState;
      params?: Dictionary<any>;
    }>(),
  },
});
