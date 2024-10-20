import { Controller, Post } from '@nestjs/common';

@Controller('scrape')
export class ScrapeController {
  @Post('scrape')
  postScraper() {
    return 'Hello World!';
  }
}
