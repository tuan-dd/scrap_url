import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NodeCommonModule } from './node-common.module';

@Module({
  imports: [
    NodeCommonModule.forRootAsync({
      useFactory: () => ({
        env: 'development', // configService.get('NODE_ENV')
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
