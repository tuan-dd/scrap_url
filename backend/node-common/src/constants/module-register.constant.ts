import { ConfigModuleOptions } from '@interfaces';
import { ConfigurableModuleBuilder } from '@nestjs/common';

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE: MODULE_OPTIONS_TYPE,
  ASYNC_OPTIONS_TYPE: MODULE_ASYNC_OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<ConfigModuleOptions>()
  .setClassMethodName('forRoot')
  .build();
