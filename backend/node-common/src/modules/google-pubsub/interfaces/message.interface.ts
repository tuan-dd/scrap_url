import { PreciseDate } from '@google-cloud/precise-date';
import { PublishOptions, SubscriptionOptions } from '@google-cloud/pubsub';
import { MessageOptions } from '@google-cloud/pubsub/build/src/topic.js';

export interface Message {
  ackId: string;
  attributes: {
    [key: string]: string;
  };
  data: Buffer;
  deliveryAttempt: number;
  id: string;
  orderingKey?: string;
  publishTime: PreciseDate;
  received: number;
}

export interface SendMessageConfig {
  topicName: string;
  publishOptions?: PublishOptions | undefined;
  message: MessageOptions;
}

export interface registerSubscription {
  topicName: string;
  subscriptionName: string;
  subscriptionOptions?: SubscriptionOptions;
  publishOptions?: PublishOptions | undefined;
}

export interface TopicConfig {
  topicName: string;
  publishOptions?: PublishOptions;
}
