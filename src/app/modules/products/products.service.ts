import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Product } from 'app/shared/models/product.model';
import { API_BASE_URL, API_VERSION } from 'app/configs/app.config';
import { PaginationResponse } from 'app/shared/models/responses/pagination.response';
import { ResponseResult } from 'app/shared/models/responses/responseresult.model';


@Injectable({ providedIn: 'root' })
export class ProductService {
  private productUrl = `${API_BASE_URL}/api/${API_VERSION}/products`;

  constructor(private http: HttpClient) {
  }

  getProducts(qParams: any) {
    return this.http.get<ResponseResult<PaginationResponse<Product>>>(`${this.productUrl}`, { params: qParams });
  }

  getProduct(id: number) {
    return this.http.get<ResponseResult<Product>>(`${this.productUrl}/${id}`);
  }

  createProduct(product: Product) {
    return this.http.post<ResponseResult<Product>>(`${this.productUrl}`, product);
  }

  updateProduct(id: number, data: any) {
    return this.http.patch<ResponseResult<Product>>(`${this.productUrl}/${id}`, data);
  }

  deleteProduct(id: number) {
    return this.http.delete<ResponseResult<null>>(`${this.productUrl}/${id}`);
  }
}