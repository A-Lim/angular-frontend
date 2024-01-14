import { TokenData } from '@core/models/tokendata.model';
import { User } from '@core/models/user.model';

export interface AuthData extends TokenData {
  user: User;
  permissions: string[];
}
