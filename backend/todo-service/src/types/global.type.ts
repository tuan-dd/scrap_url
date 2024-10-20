import { ConfigService as BaseConfigService } from '@nestjs/config';
import { Configuration } from 'config';

declare module '@nestjs/config' {
  interface CustomConfigService extends BaseConfigService<Configuration> {
    get(key: keyof Configuration): Configuration[keyof Configuration];
  }
}
