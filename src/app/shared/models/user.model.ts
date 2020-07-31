import { UserGroup } from './usergroup.model';

export interface User {
    id: number;
    name: string;
    email: string;
    avatar: string[];
    email_verified_at: string;
    status: string;
    usergroups: UserGroup[];
}