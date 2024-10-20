import { Controller, Get, Put } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Configuration } from 'config';
import { InternalHttpClientService } from 'node-common';

@Controller('user')
export class UserController {
  baseUrl: string;
  constructor(
    private readonly httpClient: InternalHttpClientService,
    private readonly configService: ConfigService<Configuration>,
  ) {
    this.httpClient.setName('user-service');
    this.baseUrl = this.configService.get('serviceUrl').userUrl;
  }
  @Put('me')
  async updateMe() {
    return this.httpClient.forwardFromRequest(this.baseUrl + 'user/me', 'PUT');
  }

  @Get('/me')
  async me() {
    return this.httpClient.forwardFromRequest(this.baseUrl + 'user/me', 'GET');
  }
}
