import type { UserRole } from '@emx/orm';

export interface UserJWT {
  id: number;
  email: string;
  phone: string;
  role: UserRole;
  // createdAt: Date;
  // updatedAt: Date;
}
