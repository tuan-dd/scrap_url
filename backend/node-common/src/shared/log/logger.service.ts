import { Injectable, Logger, LoggerService } from '@nestjs/common';

@Injectable()
export class CustomLogger extends Logger implements LoggerService {
  constructor() {
    super(CustomLogger.name);
  }
  // TODO override
  info(message: any, context?: string): void;
  info(message: any, ...optionalParams: any[]): void;
  info(message: unknown, context?: unknown, ...rest: unknown[]): void {
    this.log(message, context, rest);
  }
}
