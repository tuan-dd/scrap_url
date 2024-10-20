import { Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  BaseService,
  InternalHttpClientService,
  ServiceConfig,
} from 'node-common';
import { PATH } from '../enums';

@Injectable({ scope: Scope.REQUEST })
export class AuthService extends BaseService {
  private readonly authConfig: ServiceConfig;
  constructor(
    private readonly configService: ConfigService,
    private readonly httpInternalService: InternalHttpClientService,
  ) {
    super();
    this.authConfig = this.configService.get<ServiceConfig>('authService');
  }

  async verify() {}
}
