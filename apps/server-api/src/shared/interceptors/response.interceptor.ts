import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map } from 'rxjs';
import { ResponseBase } from '@emx/types';
import { ResponseFactory } from '@emx/core';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ResponseBase<T>> {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((data) => {
        if (data instanceof ResponseFactory) {
          return data.data;
        }
        return data;
      })
    );
  }
}
