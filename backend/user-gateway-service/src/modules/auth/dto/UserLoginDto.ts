import { IsNumberString, IsString } from 'class-validator';

export class UserLoginDto {
  @IsNumberString()
  readonly phone: string;

  @IsString()
  readonly password: string;
}

export class UserTokenResponseDto {
  AccessToken: string;

  ExpiresIn: number;

  RefreshToken: string;
}

export class UserRetakeTokenDto {
  AccessToken: string;

  ExpiresIn: number;
}
