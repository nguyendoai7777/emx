import { IsDefined, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Max, Min } from 'class-validator';
import { DtoPagination } from './pagination.dto.js';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import type { ProductState } from '@emx/orm';

export class DtoProduct {
  @IsNotEmpty()
  @IsDefined()
  name: string;

  @IsNotEmpty()
  @IsDefined()
  brand: string;

  @IsNotEmpty()
  @IsDefined()
  title: string;

  @IsNotEmpty()
  @IsDefined()
  description: string;

  @IsInt()
  @IsNumber()
  @IsNotEmpty()
  @IsDefined()
  price: number;

  @IsInt()
  @IsNumber()
  @IsNotEmpty()
  @IsDefined()
  stock: number;

  @IsInt()
  @IsNumber()
  @IsNotEmpty()
  @IsDefined()
  discountPercent: number;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  conditionType: ProductState;

  @IsInt()
  @IsNumber()
  @IsNotEmpty()
  @IsDefined()
  categoryId: number;
}

export class DtoSearchProduct extends DtoPagination {
  @IsOptional()
  @IsInt({ message: 'discountPercent phải là số nguyên' })
  @Min(0, { message: 'discountPercent không được nhỏ hơn 0' })
  @Max(100, { message: 'discountPercent không được lớn hơn 100' })
  @Transform(({ value }) => (value ? Number(value) : undefined))
  @ApiProperty({ required: false, type: 'string', description: 'Lọc theo % giảm giá (>=)' })
  discountPercent?: number;

  @IsOptional()
  @IsPositive({ message: 'categoryId phải là số dương' })
  @Transform(({ value }) => (value ? Number(value) : undefined))
  @ApiProperty({ required: false, type: 'string', description: 'Lọc theo categoryId' })
  categoryId?: number;
}
