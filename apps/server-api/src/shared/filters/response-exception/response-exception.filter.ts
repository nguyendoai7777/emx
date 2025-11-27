import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ResponseTransformer, TCast } from '@shop/factory';
import { c } from '@utils';

@Catch(BadRequestException)
export class ResponseExceptionFilter implements ExceptionFilter {
  constructor() {}
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();

    let errorMess: any;
    const isBadRequestFilter = (exception.getResponse() as BadRequestException).message;
    const tryAsResponseTransformer = exception.getResponse() as any;
    console.log(c.bold.hex('#ff1493')`@@ BadRequestException`, exception.getResponse());
    if (tryAsResponseTransformer instanceof ResponseTransformer) {
      errorMess = tryAsResponseTransformer.data;
    } else if (Array.isArray(isBadRequestFilter)) {
      const errors = TCast<string[]>(isBadRequestFilter);
      const validationMap: Record<string, string> = {};
      for (const msg of errors) {
        const parts = msg.split(' ');
        const key = parts.shift()!;
        validationMap[key] = parts.join(' ').trim();
      }

      errorMess = {
        message: 'update failed',
        data: validationMap,
        status: HttpStatus.BAD_REQUEST,
      };
    } else {
      console.log(c.bold.hex('#ff1493')`@@ Case else`);
      errorMess = {
        message: exception.message,
        status: HttpStatus.BAD_REQUEST,
      };
    }

    console.log(c.bold.underline.green`@@ final`, errorMess);

    res.status(HttpStatus.BAD_REQUEST).json(errorMess);
  }
}
