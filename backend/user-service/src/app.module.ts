import { Module } from '@nestjs/common';
import { ConfigurationBase, NodeCommonModule } from 'node-common';
import { validate } from 'config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from '@module/auth';

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
      useFactory: (configService: ConfigService<ConfigurationBase>) => ({
        env: configService.get('env'),
      }),
      inject: [ConfigService],
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
