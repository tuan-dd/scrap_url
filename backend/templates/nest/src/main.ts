import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { CustomLogger } from 'node-common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(CustomLogger);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port');
  // Enable version
  app.enableVersioning({
    defaultVersion: '1.0',
    type: VersioningType.URI,
  });

  // enable graceful shutdown
  app.enableShutdownHooks();
  await app.listen(port);
  logger.log(`Application listen on ${await app.getUrl()}`);
}
bootstrap();
