import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@environments/environment';
import { Dictionary } from '@ngrx/entity';
import { Pagination } from '@core/models/pagination.model';
import { Response } from '@core/models/response.model';
import { Appointment } from '../models/appontment.model';

@Injectable({ providedIn: 'root' })
export class AppointmentsApiService {
  private _http = inject(HttpClient);
  private _url = `${environment.apiUrl}/api/${environment.apiVersion}/appointments`;

  getAppointments(qParams: Dictionary<any>) {
    return this._http.get<Response<Pagination<Appointment | null>>>(`${this._url}`, {
      params: qParams,
    });
  }

  createAppointment(data: Dictionary<any>[]) {
    return this._http.post<Response<Appointment>>(`${this._url}`, data);
  }

  updateAppointment(id: number, data: Dictionary<any>) {
    return this._http.patch<Response<Appointment>>(`${this._url}/${id}`, data);
  }

  deleteAppointment(id: number) {
    return this._http.delete<Response<void>>(`${this._url}/${id}`);
  }
}
