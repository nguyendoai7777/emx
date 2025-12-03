import { SetMetadata, applyDecorators, UseGuards } from '@nestjs/common';
import { UserRole } from '@emx/orm';
import { RolesGuard } from '@guards';
import { ReflectMetadataKey } from '@constants';

export const AllowRole = (...roles: UserRole[]) =>
  applyDecorators(SetMetadata(ReflectMetadataKey.AllowRoles, roles), UseGuards(RolesGuard));
