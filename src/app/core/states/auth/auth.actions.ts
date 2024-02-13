import { Dictionary } from '@ngrx/entity';
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { AuthData } from '@core/models/authdata.model';
import { User } from '@core/models/user.model';
import { FileDetail } from '@shared/models/filedetail.model';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    Login: props<{ email: string; password: string }>(),
    'Login Success': props<{ authData: AuthData }>(),
    'Login Failure': props<{ error: string }>(),
    'Clear Error': emptyProps(),
    'Store Auth Data': props<{ authData: AuthData }>(),
    'Update Profile': props<{ user: User }>(),
    'Update Avatar': props<{ avatar: FileDetail }>(),
    'Get My Permissions': emptyProps(),
    'Get My Permissions Success': props<{ permissions: string[] }>(),
    'Load Auth Data': emptyProps(),
    'Load Auth Data Success': props<{
      user: User;
      accessToken: string;
      expiresAt: string;
    }>(),
    'Load Auth Data Failure': emptyProps(),
    'Clear Auth Data': emptyProps(),
    Logout: emptyProps(),
    'Logout Success': emptyProps(),
  },
});
