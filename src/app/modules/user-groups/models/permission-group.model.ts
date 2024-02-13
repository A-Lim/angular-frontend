import { Permission } from './permission.model';

export interface PermissionGroup {
  id: number;
  code: string;
  name: string;
  description: string;
  permissions: Permission[];
}
