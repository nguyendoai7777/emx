import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import chalk from 'chalk';
import { Deeppink, DodgeBlue, RedisKey, ReflectMetadataKey } from '@constants';
import { RedisService } from '@services';
import { UserJWT } from '@emx/types';
import { Reflector } from '@nestjs/core';

function pathToRegex(pattern: string): RegExp {
  let regexStr = pattern.replace(/\*\*/g, '<<<DOUBLE>>>').replace(/\*/g, '<<<SINGLE>>>');
  regexStr = regexStr.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
  regexStr = regexStr.replace(/<<<DOUBLE>>>/g, '.*').replace(/<<<SINGLE>>>/g, '[^/]+');

  return new RegExp(`^${regexStr}$`);
}

function isOpenRoute(url: string, routes: string[]): boolean {
  const path = url.split('?')[0].split('#')[0];
  return routes.some((pattern) => pathToRegex(pattern).test(path));
}
const openRoutes = ['/api/auth/**', '/api/public/**', '/api/ping', '/api/seed'];

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redis: RedisService,
    private readonly reflector: Reflector
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    console.log(chalk.hex(Deeppink).bold(`@@`), chalk.hex(DodgeBlue).bold(`[${request.method}]`));
    console.log({
      url: request.url,
      isPublic: isOpenRoute(request.url, openRoutes),
    });

    const isPublic = this.reflector.get<boolean>(ReflectMetadataKey.IsPublicRoute, context.getHandler());
    if (isPublic) {
      return true;
    }
    if (isOpenRoute(request.url, openRoutes)) {
      return true;
    }

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    const user = await this.jwtService.verifyAsync<UserJWT>(token);
    const accessKey = `${RedisKey.tokenAccess}:${user.id}`;
    const storedToken = await this.redis.get<string>(accessKey);
    if (!storedToken || storedToken !== token) {
      throw new UnauthorizedException();
    }
    request['user'] = user;

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
