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

export type ResponseWithPagination<T> = ResponseBase<T> & {
  pagination: Prettify<Pagination & { total: number }>;
};


export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: UserJWT
}