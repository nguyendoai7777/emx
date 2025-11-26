import { ResponseBase, ResponseWithPagination } from '@jpa/types';

export class ResponseFactory<T = void> {
  constructor(protected option: ResponseBase<T>) {}

  get data() {
    return this.option;
  }
}

export class ResponsePaginationFactory<T> extends ResponseFactory<T> {
  constructor(public override option: ResponseWithPagination<T>) {
    super(option);
  }
}
