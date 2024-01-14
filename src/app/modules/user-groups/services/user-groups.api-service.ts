import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Pagination } from '@core/models/pagination.model';
import { Response } from '@core/models/response.model';
import { UserGroup } from '@modules/user-groups/models/usergroup.model';

@Injectable({ providedIn: 'root' })
export class UserGroupsApiService {
  private baseUrl = `${environment.apiUrl}/api/${environment.apiVersion}`;
  private userGroupsUrl = `${this.baseUrl}/usergroups`;

  constructor(private http: HttpClient) {}

  getUserGroups(qParams: any) {
    return this.http.get<Response<Pagination<UserGroup | null>>>(
      `${this.userGroupsUrl}`,
      {
        params: qParams,
      }
    );
  }

  getUserGroup(id: number) {
    return this.http.get<Response<UserGroup>>(`${this.userGroupsUrl}/${id}`);
  }
}
