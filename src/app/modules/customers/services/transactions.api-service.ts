import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@environments/environment';
import { Dictionary } from '@ngrx/entity';
import { Response } from '@core/models/response.model';
import { Transaction } from '../models/transaction.model';

@Injectable({ providedIn: 'root' })
export class TransactionsApiService {
  private _http = inject(HttpClient);
  private _url = `${environment.apiUrl}/api/${environment.apiVersion}/transactions`;

  createTransaction(data: Dictionary<any>[]) {
    return this._http.post<Response<Transaction>>(`${this._url}`, data);
  }

  updateTransaction(id: number, data: Dictionary<any>) {
    return this._http.patch<Response<Transaction>>(`${this._url}/${id}`, data);
  }

  deleteTransaction(id: number) {
    return this._http.delete<Response<void>>(`${this._url}/${id}`);
  }
}
