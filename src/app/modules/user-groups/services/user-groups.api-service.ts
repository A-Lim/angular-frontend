import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Dictionary } from '@ngrx/entity';
import { Pagination } from '@core/models/pagination.model';
import { Response } from '@core/models/response.model';
import { User } from '@core/models/user.model';
import { UserGroup } from '@modules/user-groups/models/usergroup.model';

@Injectable({ providedIn: 'root' })
export class UserGroupsApiService {
  private _baseUrl = `${environment.apiUrl}/api/${environment.apiVersion}`;
  private _userGroupsUrl = `${this._baseUrl}/usergroups`;

  constructor(private http: HttpClient) {}

  checkCodeExists(code: string, userGroupId?: number) {
    return this.http.post<Response<boolean>>(`${this._userGroupsUrl}/exists`, {
      code,
      userGroupId,
    });
  }

  getUserGroups(qParams: Dictionary<any>) {
    return this.http.get<Response<Pagination<UserGroup | null>>>(
      `${this._userGroupsUrl}`,
      {
        params: qParams,
      }
    );
  }

  getUserGroup(id: number) {
    return this.http.get<Response<UserGroup>>(`${this._userGroupsUrl}/${id}`);
  }

  getUsers(id: number, qParams: Dictionary<any>) {
    return this.http.get<Response<Pagination<User>>>(
      `${this._userGroupsUrl}/${id}/users`,
      { params: qParams }
    );
  }

  // list users that are not inside usergroup
  getNotUsers(id: number, qParams: Dictionary<any>) {
    return this.http.get<Response<Pagination<User>>>(
      `${this._userGroupsUrl}/${id}/notusers`,
      { params: qParams }
    );
  }

  createUserGroup(value: Dictionary<any>) {
    return this.http.post<Response<UserGroup>>(`${this._userGroupsUrl}`, value);
  }

  updateUserGroup(id: number, value: Dictionary<any>) {
    return this.http.patch<Response<UserGroup>>(
      `${this._userGroupsUrl}/${id}`,
      value
    );
  }

  deleteUserGroup(id: number) {
    return this.http.delete<Response<null>>(`${this._userGroupsUrl}/${id}`);
  }

  addUsers(id: number, userIds: number[]) {
    const data = { userIds: userIds };
    return this.http.post<Response<null>>(
      `${this._userGroupsUrl}/${id}/users`,
      data
    );
  }

  removeUser(id: number, userId: number) {
    return this.http.delete<Response<null>>(
      `${this._userGroupsUrl}/${id}/users/${userId}`
    );
  }
}
