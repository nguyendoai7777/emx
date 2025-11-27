import { BadRequestException, createParamDecorator, ExecutionContext, Param, ParseIntPipe } from '@nestjs/common';

export const User = createParamDecorator((data: string | undefined, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  return data ? req.user?.[data] : req.user;
});

export const SlugNumber = createParamDecorator((paramName: string, ctx: ExecutionContext): number => {
  const request = ctx.switchToHttp().getRequest();
  const value = request.params[paramName];

  if (value === undefined) {
    throw new BadRequestException(`Parameter '${paramName}' is required`);
  }

  const parsedValue = parseInt(value, 10);

  if (isNaN(parsedValue)) {
    throw new BadRequestException(`Parameter '${paramName}' must be a valid number`);
  }

  return parsedValue;
});

/**
 * Phiên bản optional - không throw error nếu param không tồn tại
 * Sử dụng: @OptionalNumberParam('id') id?: number
 */
export const OptionalNumberParam = createParamDecorator(
  (paramName: string, ctx: ExecutionContext): number | undefined => {
    const request = ctx.switchToHttp().getRequest();
    const value = request.params[paramName];

    if (value === undefined || value === null) {
      return undefined;
    }

    const parsedValue = parseInt(value, 10);

    if (isNaN(parsedValue)) {
      throw new BadRequestException(`Parameter '${paramName}' must be a valid number`);
    }

    return parsedValue;
  }
);
