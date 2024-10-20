import { Inject } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import Redis from 'ioredis';
import { AppLogger } from 'node-common';
import { ConfigService } from '@nestjs/config';
import { Configuration } from 'config';

interface Notification {
  id: string;
  message: any;
  userId: number;
  type: string;
}

@WebSocketGateway()
export class SocketGatewayGateway
  implements OnGatewayInit, OnGatewayConnection
{
  private redisClient: Redis;
  private readonly redisChannel = 'TODO_SERVICE';
  private io: Server;
  constructor(
    private configService: ConfigService<Configuration>,
    private logger: AppLogger,
  ) {
    this.Init();
  }

  async Init() {
    this.redisClient = new Redis({
      host: this.configService.get('redis').host,
      port: this.configService.get('redis').port,
      password: this.configService.get('redis').password,
    });

    // Listen for messages on the specified Redis channel
    this.redisClient.subscribe(this.redisChannel, (error, count) => {
      if (error) {
        this.logger.error(
          `Failed to subscribe to Redis channel: ${error.message}`,
        );
      } else {
        this.logger.log(
          `Subscribed to Redis channel: ${this.redisChannel} (${count} channels)`,
        );
      }
    });

    // Handle incoming messages from Redis and send them to connected clients
    this.redisClient.on('message', (channel, message) => {});
  }

  @SubscribeMessage('notification')
  handleMessage(client: Socket, payload: any): string {
    return 'Hello world!';
  }

  afterInit(server: Server) {
    this.io = server;
    server.use(async (socket, next) => {
      const [type, token] =
        socket.handshake.headers.authorization?.split(' ') ?? [];
      const bearerToken = type === 'Bearer' ? token : undefined;

      if (!bearerToken) {
        next(new Error('Unauthorized'));
        return;
      }

      try {
        const payload = {}; // Implement JWT verification or other auth checks here
        socket.data = { user: payload };
        next();
      } catch (error) {
        next(new Error('Unauthorized'));
      }
    });
  }

  handleConnection(client: Socket) {
    // Assuming `client.data.user.id` exists after authentication
    const userId = client.data.user.id;
    if (userId) {
      client.join(userId.toString());
      console.log(`Client with user ID ${userId} connected and joined room.`);
    }
  }

  handleSendNotification(notification: Notification) {
    // Emit the notification to the specific user's room
    this.io
      .to(notification.userId.toString())
      .emit('notification', { ...notification, unread: true });
  }
}
