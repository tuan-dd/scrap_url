import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
// import { UserRegisterDto } from './dto/UserRegisterDto';
import { UserRetakeTokenDto, UserTokenResponseDto } from './dto/UserLoginDto';
// import { LocalAuthGuard } from './guards/local-auth.guard';
import { RfAuthGuard } from './guards/refresh_token.guard';
import { Public } from '@decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  @Public()
  async signUp() {
    console.log('sign up');
    // return this.authService.createUser();
  }

  @Post('/sign-in')
  @Public()
  async signIn(): Promise<UserTokenResponseDto> {
    return this.authService.signIn();
  }

  @Post('/refresh-token')
  @Public()
  @UseGuards(RfAuthGuard)
  async newToken() {
    return this.authService.newToken();
  }
}
