import type { Observable } from 'rxjs';
import { ResponseWithPagination, WithID } from '@emx/types';
import { WritableSignal } from '@angular/core';
import { DtoPagination } from '@emx/dto';

export interface ListBaseImpl {
  getList<TDataObs extends WithID>(
    url: string,
    params?: object | undefined
  ): Observable<ResponseWithPagination<TDataObs[]>>;
}

export interface ListBaseFnReturn<D> {
  loading: WritableSignal<boolean>;
  data: WritableSignal<D[]>;
  paginator: WritableSignal<DtoPagination>;
  totalRecords: WritableSignal<number>;
  getList(): void;
}

export type ListBaseFn = <D>(url: string) => ListBaseFnReturn<D>;
