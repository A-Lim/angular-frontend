import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { environment } from '@environments/environment';
import { Dictionary } from '@ngrx/entity';
import { Response } from '@core/models/response.model';
import { User } from '@core/models/user.model';
import { FileDetail } from '@shared/models/filedetail.model';

@Injectable({ providedIn: 'root' })
export class ProfileApiService {
  private baseUrl = `${environment.apiUrl}/api/${environment.apiVersion}`;
  private profileUrl = `${this.baseUrl}/profile`;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private http: HttpClient
  ) {}

  updateProfile(data: Dictionary<any>) {
    if (data['date_of_birth'] instanceof Date)
      data['date_of_birth'] = formatDate(
        data['date_of_birth'],
        'yyyy-MM-dd',
        this.locale
      );

    return this.http.patch<Response<User>>(`${this.profileUrl}`, data);
  }

  updateProfileAvatar(id: number, file: File) {
    var formData = new FormData();
    formData.append('avatar', file);
    formData.append('_method', 'PATCH');
    return this.http.post<Response<FileDetail>>(
      `${this.profileUrl}/avatar`,
      formData
    );
  }
}
