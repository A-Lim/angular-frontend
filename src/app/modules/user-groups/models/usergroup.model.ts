import { User } from '@core/models/user.model';
import { Permission } from '@modules/user-groups/models/permission.model';

export interface UserGroup {
  id: number;
  name: string;
  code: string;
  status: string;
  is_admin: boolean;
  users?: User[];
  permissions?: Permission[];
}
