import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { DtoPagination } from '@emx/dto';
import { ProductCategory, ResponseBase } from '@emx/types';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly http = inject(HttpClient);
  getList(options: DtoPagination) {
    return this.http.get<ResponseBase<ProductCategory[]>>(`/category`, {
      params: { ...options },
    });
  }

  create(payload: any) {
    return this.http.post(`/category`, payload);
  }

  update(payload: any) {
    return this.http.post(`/category`, payload);
  }
}
