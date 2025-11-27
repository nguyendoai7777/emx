import { BadRequestException, HttpStatus } from '@nestjs/common';
import { hash } from 'argon2';
import { ResponseTransformer } from '@shop/factory';

export const verifyPassword = async (password: string, verifiedPassword: string) => {
  if (verifiedPassword !== password) {
    throw new BadRequestException(
      new ResponseTransformer({
        message: 'Password không khớp',
        status: HttpStatus.BAD_REQUEST,
      })
    );
  }

  return await hash(password, {
    memoryCost: 2 ** 10,
  });
};
