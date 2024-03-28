import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@environments/environment';
import { Dictionary } from '@ngrx/entity';
import { Pagination } from '@core/models/pagination.model';
import { Response } from '@core/models/response.model';
import { Customer } from './models/customer.model';

@Injectable({ providedIn: 'root' })
export class CustomersApiService {
  private _http = inject(HttpClient);
  private _baseUrl = `${environment.apiUrl}/api/${environment.apiVersion}`;
  private _customersUrl = `${this._baseUrl}/customers`;

  getCustomers(qParams: Dictionary<any>) {
    return this._http.get<Response<Pagination<Customer | null>>>(`${this._customersUrl}`, {
      params: qParams,
    });
  }

  getCustomer(id: number) {
    return this._http.get<Response<Customer>>(`${this._customersUrl}/${id}`);
  }

  bulkCreateCustomers(data: Dictionary<any>[]) {
    return this._http.post<Response<void>>(`${this._customersUrl}/bulk`, data);
  }

  updateCustomer(id: number, value: Dictionary<any>) {
    return this._http.patch<Response<Customer>>(`${this._customersUrl}/${id}`, value);
  }

  deleteCustomer(id: number) {
    return this._http.delete<Response<null>>(`${this._customersUrl}/${id}`);
  }
}
