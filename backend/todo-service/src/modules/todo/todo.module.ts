import { Module } from '@nestjs/common';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { ConfigService, CustomConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'TODO_SERVICE',
        useFactory: async (configService: CustomConfigService) => ({
          transport: Transport.REDIS,
          options: {
            host: configService.get('redis').host,
            port: configService.get('redis').port,
            password: configService.get('redis').password,
          },
        }),

        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}
