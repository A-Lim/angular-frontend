import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { environment } from '@environments/environment';
import { Dictionary } from '@ngrx/entity';
import { Pagination } from '@core/models/pagination.model';
import { Response } from '@core/models/response.model';
import { User } from '@core/models/user.model';
import { FileDetail } from '@shared/models/filedetail.model';

@Injectable({ providedIn: 'root' })
export class UsersApiService {
  private baseUrl = `${environment.apiUrl}/api/${environment.apiVersion}`;
  private userUrl = `${this.baseUrl}/users`;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private http: HttpClient
  ) {}

  getUsers(qParams: any) {
    return this.http.get<Response<Pagination<User | null>>>(`${this.userUrl}`, {
      params: qParams,
    });
  }

  getUser(id: number) {
    return this.http.get<Response<User>>(`${this.userUrl}/${id}`);
  }

  updateUser(id: number, data: Dictionary<any>) {
    if (data['date_of_birth'] instanceof Date)
      data['date_of_birth'] = formatDate(
        data['date_of_birth'],
        'yyyy-MM-dd',
        this.locale
      );

    return this.http.patch<Response<User>>(`${this.userUrl}/${id}`, data);
  }

  updateUserAvatar(id: number, file: File) {
    var formData = new FormData();
    formData.append('avatar', file);
    formData.append('_method', 'PATCH');
    return this.http.post<Response<FileDetail>>(
      `${this.userUrl}/${id}/avatar`,
      formData
    );
  }

  resetUserPassword(id: number) {
    return this.http.post<Response<string>>(
      `${this.userUrl}/${id}/reset-password`,
      null
    );
  }
}
