import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { useMsgPackr } from '@common/constants';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly http = inject(HttpClient);
  createProduct(data: any) {
    const blob = new Blob([data], { type: 'application/x-msgpack' });
    return this.http.post('/product/m', blob, {
      context: useMsgPackr(),
      responseType: 'arraybuffer',
    });
  }
}
