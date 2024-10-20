import { Environment } from '~/enums';

export interface SubscriptionConfig {
  subscription: string;
  topic: string;
}

export interface ServiceConfig {
  host: string;
  port: number;
}

export interface ConfigurationBase {
  tz: string;
  port: number;
  env: Environment;
  isProduction: boolean;
  isDevelopment: boolean;
  isStaging: boolean;
  serverName: string;
  pubSub?: {
    keyFile: string;
    topics: Record<string, string>;
    subscriptions: Record<string, SubscriptionConfig>;
  };
  authService: ServiceConfig;
  memoryCache: {
    enabled: boolean;
    ttl: number;
    max: number;
    maxSize: number;
  };
  alert: {
    chatKey: string;
    chatSpace: string;
    chatToken: string;
  };
}

export type ConfigSubscriptions = ConfigurationBase['pubSub']['subscriptions'];
export type ConfigTopics = ConfigurationBase['pubSub']['topics'];
