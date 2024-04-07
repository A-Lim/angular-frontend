import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@environments/environment';
import { Dictionary } from '@ngrx/entity';
import { Pagination } from '@core/models/pagination.model';
import { Response } from '@core/models/response.model';
import { Package } from './models/package.model';

@Injectable({ providedIn: 'root' })
export class PackagesApiService {
  private _http = inject(HttpClient);
  private _baseUrl = `${environment.apiUrl}/api/${environment.apiVersion}`;
  private _packagesUrl = `${this._baseUrl}/packages`;

  getAllPackages() {
    return this._http.get<Response<Package[]>>(`${this._packagesUrl}/all`);
  }

  getPackages(qParams?: Dictionary<any>) {
    return this._http.get<Response<Pagination<Package | null>>>(`${this._packagesUrl}`, {
      params: qParams,
    });
  }

  getPackage(id: number) {
    return this._http.get<Response<Package>>(`${this._packagesUrl}/${id}`);
  }

  bulkCreatePackages(data: Dictionary<any>[]) {
    return this._http.post<Response<void>>(`${this._packagesUrl}/bulk`, data);
  }

  updatePackage(id: number, value: Dictionary<any>) {
    return this._http.patch<Response<Package>>(`${this._packagesUrl}/${id}`, value);
  }

  deletePackage(id: number) {
    return this._http.delete<Response<null>>(`${this._packagesUrl}/${id}`);
  }
}
