import { ConfigModule, ConfigService } from '@nestjs/config';
import { NodeCommonModule } from 'node-common';
import { Module } from '@nestjs/common';
import { validate } from 'config/validation';
import { Configuration } from 'config/';

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
      useFactory: (configService: ConfigService<Configuration>) => ({
        env: configService.get('env'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
