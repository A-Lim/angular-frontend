import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Response } from '@core/models/response.model';
import { PermissionGroup } from '@modules/user-groups/models/permission-group.model';

@Injectable({ providedIn: 'root' })
export class PermissionApiService {
  private _permissionsUrl = `${environment.apiUrl}/api/${environment.apiVersion}/permissions`;

  constructor(private http: HttpClient) {}

  getPermissions() {
    return this.http.get<Response<PermissionGroup[]>>(`${this._permissionsUrl}`);
  }

  getMyPermissions() {
    return this.http.get<Response<string[]>>(`${this._permissionsUrl}/my`);
  }
}
