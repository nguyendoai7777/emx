import { BadRequestException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { DtoLogin } from '@emx/dto';
import { PrismaClientService } from '@prisma-client';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '@services';
import { LoginResponse, UserJWT } from '@emx/types';
import { c, ResponseFactory } from '@emx/core';
import { RedisKey } from '@constants';
import { verify } from 'argon2';
import { omitKeyInObj } from '@transformers';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaClientService,
    private readonly jwt$$: JwtService,
    private readonly redis: RedisService
  ) {}

  async refreshToken(rfToken: string) {
    const user = await this.jwt$$.verifyAsync<UserJWT>(rfToken, {
      secret: process.env.SECRET_KEY_REFRESH,
    });
    console.log(c.bold.cyan`@@ Decoded token`, user);
    const key = `${RedisKey.tokenRefresh}:${user.id}`;
    const storedToken = await this.redis.get<string>(key);
    console.log(c.bold.cyan`@@ Refresh Token`, storedToken);
    if (!storedToken || storedToken !== rfToken) {
      throw new UnauthorizedException('Refresh token không hợp lệ hoặc đã hết hạn');
    }

    const _payload: Partial<UserJWT> = {
      id: user.id,
      phone: user.phone,
      email: user.email,
    };

    const refreshToken = await this.jwt$$.signAsync(_payload, {
      secret: process.env.SECRET_KEY_REFRESH,
      expiresIn: '30d',
    });
    const accessToken = await this.jwt$$.signAsync(_payload);
    return {
      refreshToken,
      accessToken,
    };
  }

  async create() {}

  async login(dto: DtoLogin) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.username }, { username: dto.username }],
      },
    });

    const err = {
      message: `Thông tin đăng nhập không chính xác.`,
      status: HttpStatus.UNAUTHORIZED,
    };

    if (!user) throw new BadRequestException(err);
    const isValid = await verify(user.password, dto.password);
    if (!isValid) throw new BadRequestException(err);
    const refreshKey = `${RedisKey.tokenRefresh}:${user.id}`;
    const accessKey = `${RedisKey.tokenAccess}:${user.id}`;
    await Promise.all([this.redis.del(refreshKey), this.redis.del(accessKey)]);

    const payload: UserJWT = omitKeyInObj(user, 'password', 'username', 'updatedAt', 'createdAt');

    const token = await this.jwt$$.signAsync(payload);

    // Refresh Token: dài hạn
    const refreshToken = await this.jwt$$.signAsync(payload, {
      secret: process.env.SECRET_KEY_REFRESH,
      expiresIn: '30d',
    });
    const rfKey = `${RedisKey.tokenRefresh}:${user.id}`;
    const acKey = `${RedisKey.tokenAccess}:${user.id}`;

    await this.redis.set(rfKey, refreshToken, 30 * 24 * 3600);
    await this.redis.set(acKey, token, 7 * 24 * 3600);

    return new ResponseFactory<LoginResponse>({
      message: 'success',
      status: HttpStatus.OK,
      data: {
        accessToken: token,
        refreshToken,
        user: payload,
      },
    });
  }

  async logout(accessToken: string) {
    const user = await this.jwt$$.verifyAsync<UserJWT>(accessToken, {
      secret: process.env.SECRET_KEY_REFRESH,
    });
    const accessKey = `${RedisKey.tokenAccess}:${user.id}`;
    const refreshKey = `${RedisKey.tokenRefresh}:${user.id}`;
    await Promise.all([this.redis.del(refreshKey), this.redis.del(accessKey)]);
    return {
      data: 'ok',
    };
  }
}
