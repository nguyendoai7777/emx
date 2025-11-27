import { ExceptionFilter, Catch, ArgumentsHost, NotFoundException } from '@nestjs/common';
import { Response, Request } from 'express';
import { ResponseTransformer } from '@shop/factory';

@Catch(NotFoundException)
export class NotFoundFilter implements ExceptionFilter {
  catch(_: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    response.status(404).json(
      new ResponseTransformer({
        data: request.path,
        status: 404,
        message: 'API endpoint not found',
      }).data
    );
  }
}
