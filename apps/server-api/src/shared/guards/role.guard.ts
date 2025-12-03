import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { UserJWT } from '@emx/types';
import { ReflectMetadataKey } from '@constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles =
      this.reflector.get<string[]>(ReflectMetadataKey.AllowRoles, context.getHandler()) ||
      this.reflector.get<string[]>(ReflectMetadataKey.AllowRoles, context.getClass());

    if (!roles || roles.length === 0) return true; // no restriction

    const req = context.switchToHttp().getRequest();
    const user = req.user as UserJWT | undefined;

    if (!user) throw new ForbiddenException('No user authenticated');
    if (!roles.includes(user.role)) throw new ForbiddenException('Insufficient role');

    return true;
  }
}
