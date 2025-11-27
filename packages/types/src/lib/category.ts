import type { DtoCategory } from '@emx/dto';

export interface ProductCategory extends DtoCategory {
  id: number;
  createdAt: string;
  updatedAt: string;
}
