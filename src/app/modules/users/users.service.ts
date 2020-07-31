import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from 'app/shared/models/user.model';
import { UserGroup } from 'app/shared/models/usergroup.model';
import { API_BASE_URL, API_VERSION } from 'app/configs/app.config';
import { PaginationResponse } from 'app/shared/models/responses/pagination.response';
import { ResponseResult } from 'app/shared/models/responses/responseresult.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private userUrl = `${API_BASE_URL}/api/${API_VERSION}/users`;
  private userGroupUrl = `${API_BASE_URL}/api/${API_VERSION}/usergroups`;

  constructor(private http: HttpClient) {
  }

  /****** Users ******/
  getUsers(qParams: any) {
    return this.http.get<ResponseResult<PaginationResponse<User>>>(`${this.userUrl}`, { params: qParams });
  }

  getUser(id: number) {
    return this.http.get<ResponseResult<User>>(`${this.userUrl}/${id}`);
  }

  createUser() {

  }

  updateUser(id:number, data: any) {
    return this.http.patch<ResponseResult<User>>(`${this.userUrl}/${id}`, data);
  }

  getUserGroups() {
    return this.http.get<ResponseResult<UserGroup[]>>(this.userGroupUrl, { params: { all: 'true' }});
  }
}