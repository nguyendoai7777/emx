import { inject, signal } from '@angular/core';
import { DtoPagination } from '@emx/dto';
import { ListBaseService } from './list.service';
import { finalize } from 'rxjs';

export const useListBase = <D>(url: string) => {
  const loading = signal(false);
  const $$ = inject(ListBaseService);
  const paginator = signal<DtoPagination>({
    page: 1,
    size: 20,
    search: '',
  });
  const data = signal<D[]>([]);
  function getList() {
    loading.set(true);
    $$.getList<D>(url, paginator())
      .pipe(finalize(() => loading.set(false)))
      .subscribe((res) => {
        data.set(res.data);
      });
  }

  return {
    loading,
    data,
    paginator,
    getList,
  };
};
