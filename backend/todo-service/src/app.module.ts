import {
  ConfigModule,
  ConfigService,
  CustomConfigService,
} from '@nestjs/config';
import { NodeCommonModule } from 'node-common';
import { Module } from '@nestjs/common';
import { validate } from 'config/validation';
import { DatabaseModule } from '@db/database.module';
import { TodoModule } from './modules/todo/todo.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // load: [configuration],
      validate,
      validationOptions: {
        abortEarly: true,
      },
    }),
    NodeCommonModule.forRootAsync({
      useFactory: (configService: CustomConfigService) => ({
        env: configService.get('env'),
      }),
      inject: [ConfigService],
    }),

    DatabaseModule,
    TodoModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
