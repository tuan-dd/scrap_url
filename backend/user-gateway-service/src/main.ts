import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import helmet from '@fastify/helmet';
import morgan from 'morgan';
import { AppLogger } from 'node-common';
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.register(helmet);
  app.enableCors();
  app.use(morgan('combined'));
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
