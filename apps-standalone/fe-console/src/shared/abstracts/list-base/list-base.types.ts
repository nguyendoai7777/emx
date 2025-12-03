import type { Observable } from 'rxjs';
import { ResponseWithPagination, WithID } from '@emx/types';

export interface ListBaseImpl {
  getList<TDataObs extends WithID>(
    url: string,
    params?: object | undefined
  ): Observable<ResponseWithPagination<TDataObs[]>>;
}
