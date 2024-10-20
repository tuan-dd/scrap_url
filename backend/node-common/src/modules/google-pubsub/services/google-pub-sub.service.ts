import { Message, PubSub, Subscription } from '@google-cloud/pubsub';
import { StatusError } from '@google-cloud/pubsub/build/src/message-stream';
import { MessageOptions, PublishOptions, Topic } from '@google-cloud/pubsub/build/src/topic';
import { OnModuleDestroy } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AppLogger } from '@shared';
import { OnMessage, BuildEventName } from '../decorators';
import { PubSubConfigModuleOptions, SendMessageConfig, TopicConfig } from '../interfaces';
import { parseFromJson } from '~/utils';

export class GooglePubSubService implements OnModuleDestroy {
  private readonly subscriptions: Record<string, Subscription> = {};
  private pubSubClient: PubSub;
  constructor(
    private readonly configOptions: PubSubConfigModuleOptions,
    private readonly eventEmitter: EventEmitter2,
    private readonly reflector: Reflector,
    private readonly logger: AppLogger,
  ) {
    this.pubSubClient = new PubSub(configOptions);

    // Register Subscriptions
    configOptions?.subscriptions?.forEach(
      ({ topic: topicName, subscription: subscriptionName, consumeName }) => {
        this.registerSubscription(topicName, subscriptionName);
        this.consume(topicName, subscriptionName, consumeName);
      },
    );
  }

  async onModuleDestroy() {
    await Promise.all(
      Object.keys(this.subscriptions).map((key) =>
        this.subscriptions[key].close().catch((ex) => {
          this.logger.error(ex);
        }),
      ),
    );
  }

  private registerSubscription(topicName: string, subscriptionName: string) {
    const name = `${topicName}_${subscriptionName}`;
    this.subscriptions[name] = this.pubSubClient.subscription(subscriptionName, {
      topic: this.getTopic(topicName),
    });
  }

  private getSubscription(topicName: string, subscriptionName: string): Subscription {
    const name = `${topicName}_${subscriptionName}`;
    const subscription = this.subscriptions[name];
    if (!subscription) throw new Error('Subscription not registered');
    return subscription;
  }

  private getTopic(topicName: string, publishOptions?: PublishOptions | undefined): Topic {
    const topic = this.pubSubClient.topic(topicName, publishOptions);
    if (!topic) throw new Error('Topic not register');
    return topic;
  }

  private hasConsumeHandler(
    topicName: string,
    subscriptionName: string,
    consumeName?: string,
  ): boolean {
    return Reflect.getMetadata(BuildEventName(topicName, subscriptionName, consumeName), OnMessage);
  }

  private consume(topicName: string, subscriptionName: string, consumeName?: string): void {
    const subscription = this.getSubscription(topicName, subscriptionName);

    if (!this.hasConsumeHandler(topicName, subscriptionName, consumeName)) {
      this.logger.error(`Consumer handler not registered`, {
        topicName,
        subscriptionName,
        consumeName,
      });
      throw new Error(`Consumer handler not registered`);
    }

    subscription.on('message', async (message: Message) => {
      await this.eventEmitter
        .emitAsync(BuildEventName(topicName, subscriptionName, consumeName), {
          ackId: message.ackId,
          attributes: message.attributes,
          data: message.data,
          deliveryAttempt: message.deliveryAttempt,
          id: message.id,
          orderingKey: message.orderingKey,
          publishTime: message.publishTime,
          received: message.received,
          length: message.length,
        })
        .then(() => {
          message.ack();
        })
        .catch((ex) => {
          message.nack();
          this.logger.error(
            `[${parseFromJson(message.data.toString('utf-8'))['cid']}] Consume Exception`,
            ex.stack ?? JSON.stringify(ex, Object.getOwnPropertyNames(ex)),
          );
        });
    });

    subscription.on('error', (error: StatusError) =>
      this.eventEmitter.emitAsync(
        `${BuildEventName(topicName, subscriptionName, consumeName)}:error`,
        error,
      ),
    );
  }

  async publishMessage(messageConfig: SendMessageConfig): Promise<string> {
    try {
      const topic = this.pubSubClient.topic(messageConfig.topicName, messageConfig?.publishOptions);

      return topic.publishMessage(messageConfig.message);
    } catch (error) {
      this.logger.info(error, `Error in send pubsub with topic name ${messageConfig.topicName}`);
      throw new Error('Failed to send messages in pubsub');
    }
  }
}
