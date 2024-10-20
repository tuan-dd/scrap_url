import { ClientConfig } from '@google-cloud/pubsub';

export interface PubSubConfigModuleOptions extends ClientConfig {
  topics?: Array<string>;
  subscriptions: Array<{
    topic: string;
    subscription: string;
    consumeName?: string;
  }>;
  projectId?: string;
  keyFile?: string;
}
