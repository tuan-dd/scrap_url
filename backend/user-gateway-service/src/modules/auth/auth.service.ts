import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  UserLoginDto,
  UserRetakeTokenDto,
  UserTokenResponseDto,
} from './dto/UserLoginDto';
import { UserRegisterDto } from './dto/UserRegisterDto';
import { InternalHttpClientService } from 'node-common';
import { ConfigService } from '@nestjs/config';
import { Configuration } from 'config';

@Injectable()
export class AuthService {
  baseUrl: string;
  constructor(
    private readonly httpClient: InternalHttpClientService,
    private readonly configService: ConfigService<Configuration>,
  ) {
    this.httpClient.setName('authService');
    this.baseUrl = this.configService.get('serviceUrl').userUrl;
  }

  async signIn(): Promise<any> {
    return this.httpClient.forwardFromRequest(
      this.baseUrl + 'auth/login',
      'POST',
    );
    // find the user by phone
    // const enDecrypt = UtilsService.encryptData(phone);
    // const user = await this.userService.findOne({
    //   where: { phone: enDecrypt },
    //   select: ['password', 'roleId', 'id'],
    // });
    // // if user does not exist throw exception
    // if (!user) {
    //   throw new ForbiddenException(ERROR_MSG[ErrorCode.NOT_FOUND_USER]);
    // }
    // // compare password
    // const pwMatches = await UtilsService.validateHash(password, user.password);
    // // if password incorrect throw exception
    // if (!pwMatches) {
    //   throw new UnauthorizedException(ERROR_MSG[ErrorCode.INVALID_PASSWORD]);
    // }
    // return user;
  }

  async createUser(): Promise<HttpStatus> {
    return this.httpClient.forwardFromRequest(
      this.baseUrl + 'auth/register',
      'POST',
    );
  }

  async newToken() {
    return this.httpClient.forwardFromRequest(
      this.baseUrl + 'auth/refresh-token',
      'POST',
    );
  }

  /**
   * @@description store time, ip, location lastTime user sign in
   */
  // createResponseSignIn(roleId: string, userId: string): UserTokenResponseDto {
  //   this.userService.updateLatestTimeSignIn(userId);

  //   return {
  //     AccessToken: this.jwt.sign(
  //       { roleId, userId },
  //       {
  //         expiresIn: this.configServer.privateConfig.jwtConfig.expirationTime,
  //         secret: this.configServer.privateConfig.jwtConfig.key_at,
  //       },
  //     ),
  //     ExpiresIn: this.configServer.privateConfig.jwtConfig.expirationTime,

  //     RefreshToken: this.jwt.sign(
  //       { roleId, userId },
  //       {
  //         expiresIn: '2d',
  //         secret: this.configServer.privateConfig.jwtConfig.key_rt,
  //       },
  //     ),
  //   };
  // }

  async verifyUser(): Promise<any> {
    return this.httpClient.forwardFromRequest(
      this.baseUrl + 'auth/verify/',
      'POST',
    );
  }
}
