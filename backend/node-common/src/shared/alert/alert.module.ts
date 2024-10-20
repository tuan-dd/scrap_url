import { Module } from '@nestjs/common';
import { GoogleChatHttpClientService, AlertService } from './services';

@Module({
  exports: [AlertService, GoogleChatHttpClientService],
  providers: [AlertService, GoogleChatHttpClientService],
})
export class alertModule {}
