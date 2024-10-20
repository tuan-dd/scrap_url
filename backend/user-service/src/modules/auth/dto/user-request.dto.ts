import {
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { OmitType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { GeneratorService } from 'node-common';
export class CreateUserRequest {
  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(32)
  password: string;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  dateOfBirth: Date;
}

export class UserLoginRequest {
  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class NewTokenRequest {
  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @IsString()
  @IsNotEmpty()
  refreshToken: string;

  @IsNumber()
  @IsPositive()
  userId: number;
}

export class UpdateUserRequest extends OmitType(CreateUserRequest, [
  'password',
  'phone',
]) {}
