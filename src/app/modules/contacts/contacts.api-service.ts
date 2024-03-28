import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@environments/environment';
import { Dictionary } from '@ngrx/entity';
import { Pagination } from '@core/models/pagination.model';
import { Response } from '@core/models/response.model';
import { Contact } from './models/contact.model';

@Injectable({ providedIn: 'root' })
export class ContactsApiService {
  private _http = inject(HttpClient);
  private _baseUrl = `${environment.apiUrl}/api/${environment.apiVersion}`;
  private _contactsUrl = `${this._baseUrl}/contacts`;

  getContacts(qParams: Dictionary<any>) {
    return this._http.get<Response<Pagination<Contact | null>>>(`${this._contactsUrl}`, {
      params: qParams,
    });
  }

  getContact(id: number) {
    return this._http.get<Response<Contact>>(`${this._contactsUrl}/${id}`);
  }

  bulkCreateContacts(data: Dictionary<any>[]) {
    return this._http.post<Response<void>>(`${this._contactsUrl}/bulk`, data);
  }

  updateContact(id: number, value: Dictionary<any>) {
    return this._http.patch<Response<Contact>>(`${this._contactsUrl}/${id}`, value);
  }

  deleteContact(id: number) {
    return this._http.delete<Response<null>>(`${this._contactsUrl}/${id}`);
  }
}
