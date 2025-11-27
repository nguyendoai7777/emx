import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class NoCacheInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const httpContext = context.switchToHttp();
    const response = httpContext.getResponse<Response>();

    response.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

    return next.handle();
  }
}
