import { PermissionGroup } from '@modules/user-groups/models/permission-group.model';

export const SESSION_FEATURE_KEY = 'session';

export interface SessionState {
  permissions?: PermissionGroup[];
}

export const SessionStateKeys: Array<keyof SessionState> = ['permissions'];
export type SessionStateTypes = PermissionGroup[];
