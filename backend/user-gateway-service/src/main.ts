import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { CustomLogger } from 'node-common';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyHelmet from '@fastify/helmet';
import morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: true,
      maxParamLength: 1000,
      bodyLimit: 1024 * 1024 * 10,
    }),
  );
  app.enableCors();
  app.use(morgan('combined'));

  await app.register(fastifyHelmet);

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
  app.listen(port, '0.0.0.0').then(() => {
    app.getUrl().then((url) => logger.log(`Application listen on ${url}`));
  });
}
bootstrap();
