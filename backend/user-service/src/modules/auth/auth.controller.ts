import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import {
  CreateUserRequest,
  NewTokenRequest,
  UserLoginRequest,
} from './dto/user-request.dto';
import { Cons } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { Configuration } from 'config/configuration';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  async signUp(@Body() payload: CreateUserRequest) {
    return this.authService.createUser(payload);
  }

  @Post('/sign-in')
  async signIn(@Body() payload: UserLoginRequest) {
    return this.authService.signIn(payload.phone, payload.password);
  }

  @Post('/refresh-token')
  async newToken(@Body() payload: NewTokenRequest) {
    return this.authService.newToken(payload);
  }
}
