import { AuthModule } from '@module/auth/auth.module';
import { Module } from '@nestjs/common';
import {
  ConfigModule,
  ConfigService,
  CustomConfigService,
} from '@nestjs/config';
import { validate } from 'config/validation';
import { HttpModule, NodeCommonModule } from 'node-common';
import { UserController } from './modules/user/user.controller';
import { ScraperController } from './modules/scraper/scraper.controller';
import { JwtAuthGuard } from '@module/auth/guards/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { SocketGatewayModule } from './socket-gateway/socket-gateway.module';
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
    HttpModule,
    AuthModule,
    SocketGatewayModule,
  ],
  controllers: [ScraperController, UserController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
