import { ConfigurationBase } from 'node-common';

export interface Configuration extends ConfigurationBase {}

export default (config: Record<string, any>): Configuration => ({
  env: config.NODE_ENV,
  tz: config.TZ,
  port: +config.PORT,
  isProduction: config.NODE_ENV === 'production',
  isDevelopment: config.NODE_ENV === 'development',
  isStaging: config.NODE_ENV === 'staging',
  serverName: config.SERVER_NAME,
  logLevel: config.LOG_LEVEL,
  pubSub: {
    keyFile: config.GOOGLE_KEY_FILE ?? './google.config.json',
    subscriptions: {
      helloSubscription: {
        subscription: config.PUBSUB_EXAMPLE_SUBSCRIPTION,
        topic: config.PUBSUB_EXAMPLE_TOPIC,
      },
    },
    topics: {
      example: config.PUBSUB_EXAMPLE_TOPIC,
    },
  },
  memoryCache: {
    enabled: config.CACHE_ENABLED === 'true',
    ttl: config.CACHE_TTL,
    max: config.CACHE_MAX,
    maxSize: config.CACHE_MAX_SIZE,
  },
  alert: {
    chatKey: config.CHAT_KEY,
    chatSpace: config.CHAT_SPACE,
    chatToken: config.CHAT_TOKEN,
  },
});
