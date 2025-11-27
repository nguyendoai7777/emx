import { IsDefined, IsNotEmpty } from 'class-validator';

export class DtoCategory {
  @IsNotEmpty()
  @IsDefined()
  label: string;

  @IsNotEmpty()
  @IsDefined()
  value: string;
}

export class DtoCategoryDeleteQuery {
  @IsNotEmpty()
  @IsDefined()
  id: string;
}
