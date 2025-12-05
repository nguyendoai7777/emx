import { InputSignal, ModelSignal } from '@angular/core';

export interface UsePaginatorProps {
  totalRecords: InputSignal<number>;
  page: ModelSignal<number>;
  size: InputSignal<number>;
}

export type NgPageItem = number | '...';

export interface NgPaginatorImpl {
  totalRecords: InputSignal<number>;
  page: ModelSignal<number>;
  size: InputSignal<number>;
}
