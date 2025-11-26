import { IsInt, IsOptional, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class DtoPagination {
  @IsInt()
  @IsOptional()
  @Min(0, { message: `Page index không hợp lệ` })
  @Transform(({ value }) => Number(value))
  @ApiProperty({ required: false, type: 'string' })
  page = 1;

  @IsInt()
  @IsOptional()
  @Min(1, { message: `Page size không hợp lệ` })
  @Transform((params) => Number(params.value))
  @ApiProperty({ required: false, type: 'string' })
  size = 10;

  @IsOptional()
  @ApiProperty({ required: false, type: 'string' })
  search = '';
}
