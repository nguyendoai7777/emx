import { IsDefined, IsNotEmpty } from 'class-validator';

export class DtoLogin {
  @IsDefined({message: `username required`})
  @IsNotEmpty({message: `username required`})
  username: string

  @IsNotEmpty({message: `username required`})
  @IsDefined({message: `username required`})
  password: string
}