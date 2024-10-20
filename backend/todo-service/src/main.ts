import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppLogger } from 'node-common';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.enableCors();
  // app.use(morgan('combined'));

  const logger = app.get(AppLogger);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port');

  // Enable version
  app.enableVersioning({
    defaultVersion: '1',
    type: VersioningType.URI,
  });

  // enable graceful shutdown
  app.enableShutdownHooks();
  app.listen(port, '0.0.0.0', () => {
    app.getUrl().then((url) => logger.log(`Application listen on ${url}`));
  });
}
bootstrap();
