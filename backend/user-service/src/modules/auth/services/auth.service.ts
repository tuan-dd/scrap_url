import { HttpStatus, Injectable, Scope } from '@nestjs/common';
import {
  AslRequestContext,
  BaseService,
  ERROR_MSG,
  GeneratorService,
  UserInfo,
} from 'node-common';
import { prisma } from '@db/services';
import { PrismaClient, Prisma, StatusUser } from '@prisma/client';
import { TokenResponse } from '../dto/user-response.dto';
import { NewTokenRequest } from '../dto/user-request.dto';
import { ConfigService } from '@nestjs/config';
import { Configuration } from 'config/configuration';

@Injectable({ scope: Scope.REQUEST })
export class AuthService extends BaseService<PrismaClient> {
  constructor(private readonly configService: ConfigService<Configuration>) {
    super(prisma);
  }

  async signIn(phone: string, password: string): Promise<TokenResponse> {
    const user = await this.client.user.findFirst({
      where: {
        phone: phone,
        password: await GeneratorService.makeHash(password),
        status: StatusUser.ACTIVE,
      },
    });

    if (!user) {
      throw ERROR_MSG.BAD_USER_INPUT('User not found');
    }

    return this.createToken({ userId: user.id, type: user.type });
  }

  // async verifyUser(userId: number, accessToken: string): Promise<UserInfo> {}

  async createUser(user: Prisma.UserCreateInput) {
    const existedUser = await this.client.user.findFirst({
      where: {
        phone: user.phone,
        status: StatusUser.ACTIVE,
      },
    });

    if (existedUser) {
      return ERROR_MSG.BAD_USER_INPUT('User already exist');
    }

    this.client.user
      .create({
        data: {
          ...user,
          password: await GeneratorService.makeHash(user.password),
        },
      })
      .then((user) => {
        return {
          message: 'User created',
          userId: user.id,
        };
      });
  }

  async newToken(payload: NewTokenRequest): Promise<TokenResponse> {
    const isValid = await GeneratorService.verifyJwtToken(
      payload.refreshToken,
      this.configService.get('rtSecret'),
    );

    if (!isValid) {
      return ERROR_MSG.BAD_USER_INPUT('Refresh token invalid');
    }

    const [userInfoLogin, user] = await Promise.all([
      this.client.userInfoLogin.findFirst({
        where: {
          accessToken: payload.accessToken,
          refreshToken: payload.refreshToken,
          ipAddress: AslRequestContext.req.requestInfo.ipAddress,
        },
      }),
      this.client.user.findFirst({
        where: {
          id: payload.userId,
          status: StatusUser.ACTIVE,
        },
        select: {
          id: true,
          type: true,
        },
      }),
    ]);

    if (!userInfoLogin) {
      return ERROR_MSG.BAD_USER_INPUT('Refresh token invalid');
    }

    return this.createToken({ userId: user.id, type: user.type });
  }

  private async createToken(userInfo: UserInfo) {
    const accessToken = GeneratorService.createToken(
      userInfo,
      this.configService.get('atSecret'),
      {
        expiresIn: this.configService.get('atTTL'),
      },
    );

    const refreshToken = GeneratorService.createToken(
      userInfo,
      this.configService.get('rtSecret'),
      {
        expiresIn: this.configService.get('rtTTL'),
      },
    );

    const ip = AslRequestContext.req.requestInfo.ipAddress || 'UNKNOWN';
    await this.client.userInfoLogin.upsert({
      where: {
        userId: userInfo.userId,
        ipAddress: ip,
      },
      update: {
        accessToken,
        refreshToken,
      },
      create: {
        userId: userInfo.userId,
        ipAddress: ip,
        accessToken,
        refreshToken,
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
