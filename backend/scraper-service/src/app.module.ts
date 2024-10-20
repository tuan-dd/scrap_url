import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigurationBase, NodeCommonModule } from 'node-common';
import { Module } from '@nestjs/common';
import { validate } from 'config/validation';
import { DatabaseModule } from './database/database.module';
import { ScrapeModule } from './modules/scrape/scrape.module';

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
    ScrapeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
