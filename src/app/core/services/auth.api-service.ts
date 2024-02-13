import { formatDate } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, LOCALE_ID, inject } from '@angular/core';
import { environment } from '@environments/environment';
import { Dictionary } from '@ngrx/entity';
import { AuthData } from '@core/models/authdata.model';
import { Response } from '@core/models/response.model';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private _baseUrl = `${environment.apiUrl}/api/${environment.apiVersion}`;
  private _headers = new HttpHeaders().set('X-Skip-Interceptor', '');

  private _httpClient = inject(HttpClient);

  login(credentials?: Dictionary<any>) {
    return this._httpClient.post<Response<AuthData>>(
      `${this._baseUrl}/login`,
      credentials,
      { headers: this._headers }
    );
  }

  register(data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) {
    return this._httpClient.post<Response<void>>(
      `${this._baseUrl}/register`,
      data,
      {
        headers: this._headers,
      }
    );
  }

  forgotPassword(data: { email: string }) {
    return this._httpClient.post<Response<void>>(
      `${this._baseUrl}/forgot-password`,
      data,
      { headers: this._headers }
    );
  }

  logout() {
    return this._httpClient.post<Response<void>>(
      `${this._baseUrl}/logout`,
      undefined
    );
  }

  resetPassword(data: {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) {
    return this._httpClient.post<Response<void>>(
      `${this._baseUrl}/reset-password`,
      data,
      { headers: this._headers }
    );
  }
}
