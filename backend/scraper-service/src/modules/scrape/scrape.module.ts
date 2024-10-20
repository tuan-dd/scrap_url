import { Module } from '@nestjs/common';
import { ScrapeController } from './controllers/scrape.controller';
import { ScrapeService } from './services/scrape.service';

@Module({
  controllers: [ScrapeController],
  providers: [ScrapeService],
})
export class ScrapeModule {}
