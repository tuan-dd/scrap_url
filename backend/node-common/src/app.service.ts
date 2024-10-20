import { Injectable } from '@nestjs/common';
import { type Message, OnMessage } from './modules';

@Injectable()
export class AppService {
  constructor() {}
  async getHello() {
    return {
      msg: 'Hello World!',
    };
  }

  @OnMessage({
    topic: '',
    subscriptionName: '',
  })
  async subscription(message: Message) {
    console.log('=====', message.data.toString());
  }
}
