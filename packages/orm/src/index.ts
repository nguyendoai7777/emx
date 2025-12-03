import { ConditionType, Role } from './generated/enums.js';

export * from './generated/browser.js';
export { PrismaClient } from './generated/client.js';

export type UserRole = keyof typeof Role;
export type ProductState = keyof typeof ConditionType;
