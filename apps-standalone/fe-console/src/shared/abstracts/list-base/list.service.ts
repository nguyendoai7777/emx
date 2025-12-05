import { inject, Injectable } from '@angular/core';
import { ListBaseImpl } from './list-base.types';
import { HttpClient } from '@angular/common/http';
import { ResponseWithPagination } from '@emx/types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ListBaseService implements ListBaseImpl {
  private readonly http = inject(HttpClient);

  getList<TDataObs>(url: string, params?: object | undefined) {
    return this.http.get(url, { params: { ...params } }) as Observable<ResponseWithPagination<TDataObs[]>>;
  }
}
