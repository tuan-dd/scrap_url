import { DynamicModule, Module, OnModuleInit, Scope } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import {
  GOOGLE_PUBSUB_MODULE_ASYNC_OPTIONS,
  GOOGLE_PUBSUB_MODULE_OPTIONS,
  GOOGLE_PUBSUB_OPTIONS,
  GooglePubSubConfigurableModule,
} from './constants';
import { PubSubConfigModuleOptions } from './interfaces';
import { GooglePubSubService } from './services';
import { AppLogger, LoggerModule } from '~/shared';

const providers = [
  {
    provide: GooglePubSubService,
    useFactory: (
      configOptions: PubSubConfigModuleOptions,
      eventEmitter: EventEmitter2,
      reflector: Reflector,
      logger: AppLogger,
    ) => new GooglePubSubService(configOptions, eventEmitter, reflector, logger),
    inject: [GOOGLE_PUBSUB_OPTIONS, EventEmitter2, Reflector, AppLogger],
    Scope: Scope.DEFAULT,
  },
];

@Module({
  imports: [
    EventEmitterModule.forRoot({
      wildcard: false,
      maxListeners: 1,
    }),
  ],
  providers,
  exports: [GooglePubSubService],
})
export class GooglePubSubModule extends GooglePubSubConfigurableModule implements OnModuleInit {
  static forRoot(options: typeof GOOGLE_PUBSUB_MODULE_OPTIONS): DynamicModule {
    return {
      ...super.forRoot(options),
    };
  }
  static forRootAsync(options: typeof GOOGLE_PUBSUB_MODULE_ASYNC_OPTIONS): DynamicModule {
    return {
      ...super.forRootAsync(options),
    };
  }
}
