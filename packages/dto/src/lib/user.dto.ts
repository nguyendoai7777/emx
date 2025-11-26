import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  Validate,
  ValidateIf,
} from 'class-validator';
import { ApiProperty, IntersectionType } from '@nestjs/swagger';

export class UserInfoDto {
  @IsEmail({}, { message: 'Email Không đúng định dạng' })
  @IsDefined({ message: 'Email không được để trống' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsString()
  @ApiProperty({
    description: 'Validate theo email format',
    example: 'userOne@gmail.com',
    type: 'string',
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Không để trống, min length = 6, max length 255',
    example: 'Nguyyễn Văn',
    type: 'string',
  })
  firstname: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Không để trống, min length = 6, max length 255',
    example: 'Nam',
    type: 'string',
  })
  lastname: string;
}
