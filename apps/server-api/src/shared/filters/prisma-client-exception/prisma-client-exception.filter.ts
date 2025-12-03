import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

import { Response } from 'express';
import { Prisma } from '@emx/orm';
import { ResponseFactory } from '@emx/core';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

interface ORMErrorCode {
  message: string;
  code: HttpStatus | ({} & number);
}

const uniqueConstraintMessages: Record<string, ORMErrorCode> = {
  User_email_key: {
    code: HttpStatus.CONFLICT,
    message: 'Username/email này đã được sử dụng',
  },
  User_username_key: {
    code: HttpStatus.CONFLICT,
    message: 'Username/email này đã được sử dụng',
  },
  Article_title_key: {
    code: HttpStatus.CONFLICT,
    message: 'Title này đã được sử dụng',
  },
};

function mapPrismaError(exception: PrismaClientKnownRequestError) {
  if (exception.code === 'P2002') {
    const constraint = exception.meta?.target as string | undefined;

    if (constraint && uniqueConstraintMessages[constraint]) {
      return uniqueConstraintMessages[constraint];
    }

    return {
      code: HttpStatus.CONFLICT,
      message: `Dữ liệu đã tồn tại ${constraint ? ` (${constraint})` : ''}`,
    };
  }

  const defaultErrorMessages: Record<string, ORMErrorCode> = {
    P2000: {
      code: HttpStatus.BAD_REQUEST,
      message: `Giá trị quá dài cho cột trong cơ sở dữ liệu`,
    },
    P2003: {
      code: HttpStatus.BAD_REQUEST,
      message: `Vi phạm ràng buộc quan hệ (foreign key)`,
    },
    P2025: {
      code: HttpStatus.BAD_REQUEST,
      message: `Không tìm thấy bản ghi (update/delete thất bại)`,
    },
  };

  return (
    defaultErrorMessages[exception.code] || {
      message: `Có lỗi xảy ra từ cơ sở dữ liệu`,
      code: HttpStatus.BAD_GATEWAY,
    }
  );
}

@Catch(PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  override catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    console.info(`@@ PrismaClientKnownRequestError`, JSON.stringify(exception));
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const { message, code } = mapPrismaError(exception);

    response.status(HttpStatus.BAD_REQUEST).json(
      new ResponseFactory({
        message,
        status: code,
      }).data
    );
  }
}
