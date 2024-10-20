import { OnEvent } from '@nestjs/event-emitter';

export const BuildEventName = (
  topicName?: string,
  subscriptionName?: string,
  consumeName?: string,
) => {
  if (consumeName) return consumeName;
  return `${topicName}_${subscriptionName}`;
};

export type MessageRegister = {
  subscriptionName?: string;
  topic?: string;
  consumeName?: string;
};

const config = {
  promisify: true,
  async: true,
  suppressErrors: false,
};

export const OnMessage = ({
  topic,
  subscriptionName,
  consumeName,
}: MessageRegister) => {
  const pattern = BuildEventName(topic, subscriptionName, consumeName);
  Reflect.defineMetadata(pattern, true, OnMessage);
  return OnEvent(pattern, config);
};

export const OnError = ({
  topic,
  subscriptionName,
  consumeName,
}: MessageRegister) => {
  const pattern = BuildEventName(topic, subscriptionName, consumeName);
  Reflect.defineMetadata(`${pattern}:error`, true, OnError);
  return OnEvent(`${pattern}:error`, config);
};
