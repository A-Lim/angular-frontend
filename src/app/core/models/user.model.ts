import { FileDetail } from '@shared/models/filedetail.model';
import { UserGroup } from '@modules/user-groups/models/usergroup.model';

export interface User {
  id: number;
  name: string;
  phone: string;
  email: string;
  gender: string;
  date_of_birth: Date | string;
  avatar: FileDetail;
  email_verified_at: string;
  status: string;
  usergroups: UserGroup[];
}
