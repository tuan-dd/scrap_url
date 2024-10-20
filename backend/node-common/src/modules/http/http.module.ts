import { Module } from '@nestjs/common';
import { InternalHttpClientService } from './internal-http.service';

@Module({
  imports: [],
  controllers: [],
  providers: [InternalHttpClientService],
  exports: [InternalHttpClientService],
})
export class HttpModule {}
