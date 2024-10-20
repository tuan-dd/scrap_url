import { Module } from '@nestjs/common';
import { MemoryCacheService } from './services';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigurationBase } from '~/config';
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      isGlobal: true,
      useFactory: async (configService: ConfigService<ConfigurationBase>) => ({
        ...configService.get('memoryCache'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [MemoryCacheService],
  exports: [MemoryCacheService, CacheModule],
})
export class CacheManagerModule {}
