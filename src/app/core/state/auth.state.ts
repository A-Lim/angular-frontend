import { User } from '@core/models/user.model';

export interface AuthState {
  error?: string;
  authenticating: boolean;
  accessToken?: string;
  expiresAt?: string;
  user?: User;
  permissionsLoaded: boolean;
  permissions?: string[];
}
