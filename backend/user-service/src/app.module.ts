import { AuthModule } from 'nestjs/src/modules/auth';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigurationBase, NodeCommonModule } from 'node-common';
import { validate } from 'nestjs/config';

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
