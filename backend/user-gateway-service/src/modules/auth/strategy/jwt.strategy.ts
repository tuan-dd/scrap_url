import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AUTHORIZATION, ERROR_MSG, UserInfo } from 'node-common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { Configuration } from 'config/configuration';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configServer: ConfigService<Configuration>,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromHeader(AUTHORIZATION),
      ignoreExpiration: false,
      secretOrKey: configServer.get('secretKey'),
    });
  }

  async validate(payload: UserInfo) {
    // const userExisted = await this.authService.verifyUser();

    if (!payload) {
      throw ERROR_MSG.INVALID_TOKEN();
    }

    return true;
  }
}
