import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigurationBase, NodeCommonModule } from 'node-common';
import { AuthModule } from '@module/auth';
import { Module } from '@nestjs/common';
import { validate } from 'config/validation';

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
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
