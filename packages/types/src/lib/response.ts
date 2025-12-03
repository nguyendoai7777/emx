import { HttpStatus } from '@nestjs/common';
import { Prettify } from './type.js';
import { Pagination } from './paginator.js';
import { UserJWT } from './user.js';

export interface ResponseBaseShape<T> {
  message: string;
  status: HttpStatus | (number & {});
  data?: T;
}

export type ResponseBase<T = void> = [T] extends [void]
  ? Prettify<Omit<ResponseBaseShape<T>, 'data'>>
  : Required<ResponseBaseShape<T>>;

export type PaginationMeta = Prettify<
  Required<Pagination> & { total: number; totalPages: number; hasNext: boolean; hasPrev: boolean }
>;

export type ResponseWithPagination<T> = ResponseBase<T> & {
  pagination: PaginationMeta;
};

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: UserJWT;
}
