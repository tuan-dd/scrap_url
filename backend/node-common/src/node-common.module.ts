import {
  DynamicModule,
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import {
  ConfigurableModuleClass,
  MODULE_ASYNC_OPTIONS_TYPE,
  MODULE_OPTIONS_TYPE,
} from './constants';
import { CoreExceptionFilter } from './filters';
import {
  CoreResponseInterceptor,
  LoggingInterceptor,
  RequestContextInterceptor,
} from './interceptors';
import { HealthModule } from './modules';
import { SharedModule } from '@shared';
@Module({
  imports: [HealthModule, SharedModule],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestContextInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CoreResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: CoreExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          transform: true,
          whitelist: true,
          validationError: {
            target: false,
            value: false,
          },
          stopAtFirstError: true,
        }),
    },
  ],
})
export class NodeCommonModule extends ConfigurableModuleClass implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(RequestContextMiddleware).forRoutes('*');
  }
  static forRoot(options: typeof MODULE_OPTIONS_TYPE): DynamicModule {
    return {
      ...super.forRoot(options),
    };
  }

  static forRootAsync(options: typeof MODULE_ASYNC_OPTIONS_TYPE): DynamicModule {
    return {
      ...super.forRootAsync(options),
    };
  }
}
