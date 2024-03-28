import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@environments/environment';
import { Response } from '@core/models/response.model';
import { PermissionGroup } from '@modules/user-groups/models/permission-group.model';

@Injectable({ providedIn: 'root' })
export class PermissionApiService {
  private _http = inject(HttpClient);
  private _permissionsUrl = `${environment.apiUrl}/api/${environment.apiVersion}/permissions`;

  getPermissions() {
    return this._http.get<Response<PermissionGroup[]>>(`${this._permissionsUrl}`);
  }

  getMyPermissions() {
    return this._http.get<Response<string[]>>(`${this._permissionsUrl}/my`);
  }
}
