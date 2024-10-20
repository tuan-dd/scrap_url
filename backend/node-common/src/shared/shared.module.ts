import { Global, Module } from '@nestjs/common';
import { AlsModule } from './als';
import { LoggerModule } from './log';
import { alertModule } from './alert';
import { CacheManagerModule } from './cache';

@Global()
@Module({
  imports: [AlsModule, LoggerModule, alertModule, CacheManagerModule],
})
export class SharedModule {}
