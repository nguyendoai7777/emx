import { inject, signal } from '@angular/core';
import { DtoPagination } from '@emx/dto';
import { ListBaseService } from './list.service';
import { finalize } from 'rxjs';
import { ListBaseFn, ListBaseFnReturn } from './list-base.types';

export const useListBase = <D>(url: string): ListBaseFnReturn<D> => {
  const loading = signal(false);
  const totalRecords = signal(0);
  const $$ = inject(ListBaseService);
  const paginator = signal<DtoPagination>({
    page: 1,
    size: 2,
    search: '',
  });
  const data = signal<D[]>([]);
  function getList() {
    loading.set(true);
    $$.getList<D>(url, paginator())
      .pipe(finalize(() => loading.set(false)))
      .subscribe((res) => {
        data.set(res.data);
        totalRecords.set(res.pagination.total);
      });
  }

  return {
    loading,
    data,
    paginator,
    totalRecords,
    getList,
  };
};

export const useb: ListBaseFn = (url) => {
  const loading = signal(false);
  const totalRecords = signal(0);

  const $$ = inject(ListBaseService);
  const paginator = signal<DtoPagination>({
    page: 1,
    size: 2,
    search: '',
  });
  const data = signal<any[]>([]);
  function getList() {
    loading.set(true);
    $$.getList(url, paginator())
      .pipe(finalize(() => loading.set(false)))
      .subscribe((res) => {
        data.set(res.data);
        totalRecords.set(res.pagination.total);
      });
  }

  return {
    loading,
    data,
    paginator,
    totalRecords,
    getList,
  };
};
