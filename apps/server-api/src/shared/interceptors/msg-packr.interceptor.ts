import { BadRequestException, CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map } from 'rxjs';
import { Request, Response } from 'express';
import { $pack, $unpack } from '@utils';

export class MsgPackInterceptor implements NestInterceptor {
  constructor() {
    console.log(`@@ MsgPackInterceptor inited`);
  }
  intercept(context: ExecutionContext, next: CallHandler) {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    // Xử lý request nếu là msgpack
    if (request.headers['content-type'] === 'application/x-msgpack') {
      // Đọc raw body từ request
      const rawBody = request.body;
      if (Buffer.isBuffer(rawBody)) {
        try {
          const unpackedArray = $unpack(rawBody);
          const unpacked = unpackedArray.length === 1 ? unpackedArray[0] : unpackedArray;

          request.body = unpacked;
          console.log('Unpacked success with multiple:', unpackedArray);
        } catch (error) {
          console.log(`@@ error `, error);
          throw new BadRequestException('Invalid msgpack data');
        }
      }
    }

    // Xử lý response nếu client accept msgpack
    return next.handle().pipe(
      map((data) => {
        if (request.headers['accept']?.includes('application/x-msgpack')) {
          const packed = $pack(data);
          response.setHeader('Content-Type', 'application/x-msgpack');
          console.log('Packed response, size:', packed.length, 'bytes');
          return packed;
        }
        return data;
      })
    );
  }
}
