import { User } from 'app/shared/models/user.model';

export interface LoginResponse {
  tokenType: string;
  expiresIn: number;
  accessToken: string;
  refreshToken: string;
  user: User
}