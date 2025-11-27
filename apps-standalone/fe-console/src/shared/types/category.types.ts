import { Prettify } from '@emx/types';
import { DtoCategory } from '@emx/dto';

export type CreateCategoryFormProps = Prettify<
  DtoCategory & {
    id?: number;
  }
>;
