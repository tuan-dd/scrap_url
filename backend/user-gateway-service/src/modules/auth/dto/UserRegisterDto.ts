import { IsNumberString, IsString, MinLength } from 'class-validator';

export class UserRegisterDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsNumberString()
  @MinLength(4)
  phone: string;

  @IsString()
  @MinLength(6)
  password: string;
}
