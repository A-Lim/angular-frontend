import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { API_BASE_URL, API_VERSION } from 'app/configs/app.config';
import { PaginationResponse } from 'app/shared/models/responses/pagination.response';
import { Order } from 'app/shared/models/order.model';
import { OrderBadge } from 'app/shared/models/orderbadge.model';
import { OrderStatistics } from 'app/shared/models/orderstatistics.model';
import { ResponseResult } from 'app/shared/models/responses/responseresult.model';
import { OrderWorkItem } from 'app/shared/models/orderworkitem.model';


@Injectable({ providedIn: 'root' })
export class OrderService {
  private orderUrl = `${API_BASE_URL}/api/${API_VERSION}/orders`;

  constructor(private http: HttpClient) {
  }

  getBadges() {
    return this.http.get<ResponseResult<OrderBadge[]>>(`${this.orderUrl}/badges`);
  }

  getOrder(id: number) {
    return this.http.get<ResponseResult<Order>>(`${this.orderUrl}/${id}`);
  }

  getOrders(qParams: any) {
    return this.http.get<ResponseResult<PaginationResponse<Order>>>(`${this.orderUrl}`, { params: qParams });
  }

  getOrderStatistics(date: string) {
    return this.http.get<ResponseResult<OrderStatistics>>(`${this.orderUrl}/statistics`, { params: { date: date } });
  }

  createOrderWorkItem(id: number, data: any) {
    return this.http.post<ResponseResult<OrderWorkItem>>(`${this.orderUrl}/${id}/workitem`, data);
  }

  // getProduct(id: number) {
  //   return this.http.get<ResponseResult<Product>>(`${this.productUrl}/${id}`);
  // }

  // createProduct(product: Product) {
  //   return this.http.post<ResponseResult<Product>>(`${this.productUrl}`, product);
  // }

  // updateProduct(id: number, data: any) {
  //   return this.http.patch<ResponseResult<Product>>(`${this.productUrl}/${id}`, data);
  // }

  // deleteProduct(id: number) {
  //   return this.http.delete<ResponseResult<null>>(`${this.productUrl}/${id}`);
  // }
}