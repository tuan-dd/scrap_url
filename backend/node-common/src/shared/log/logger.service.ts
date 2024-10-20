import { Injectable, Logger, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigurationBase } from '~/config';

@Injectable()
export class AppLogger extends Logger implements LoggerService {
  constructor(configService: ConfigService<ConfigurationBase>) {
    super(configService.get('serverName'));
  }
  // TODO override
  // info(message: any, context?: string): void;
  // info(message: any, ...optionalParams: any[]): void;
  info(message: unknown, context?: unknown, ...rest: unknown[]): void {
    if (context) {
      this.log(message, context, rest);
    } else {
      this.log(message);
    }
  }
}
