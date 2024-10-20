import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ERROR_MSG, REFRESH_TOKEN_HEADER_KEY, UserInfo } from 'node-common';
import { Configuration } from 'config';
@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'rf') {
  constructor(configServer: ConfigService<Configuration>) {
    super({
      jwtFromRequest: ExtractJwt.fromHeader(REFRESH_TOKEN_HEADER_KEY),
      ignoreExpiration: true,
      secretOrKey: configServer.get('secretKey'),
    });
  }

  async validate(payload: UserInfo) {
    if (!payload) {
      throw ERROR_MSG.INVALID_TOKEN();
    }

    return true;
  }
}
