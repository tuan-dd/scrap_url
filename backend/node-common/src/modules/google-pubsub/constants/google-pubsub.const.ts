import { ConfigurableModuleBuilder } from '@nestjs/common';
import { PubSubConfigModuleOptions } from '../interfaces';

export const {
  ConfigurableModuleClass: GooglePubSubConfigurableModule,
  MODULE_OPTIONS_TOKEN: GOOGLE_PUBSUB_OPTIONS,
  OPTIONS_TYPE: GOOGLE_PUBSUB_MODULE_OPTIONS,
  ASYNC_OPTIONS_TYPE: GOOGLE_PUBSUB_MODULE_ASYNC_OPTIONS,
} = new ConfigurableModuleBuilder<PubSubConfigModuleOptions>()
  .setExtras(
    {
      isGlobal: true,
    },
    (definition, extras) => ({
      ...definition,
      global: extras.isGlobal,
    }),
  )
  .setClassMethodName('forRoot')
  .build();
