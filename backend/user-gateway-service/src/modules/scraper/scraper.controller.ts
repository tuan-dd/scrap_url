import { Controller, Get, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Configuration } from 'config';
import { InternalHttpClientService } from 'node-common';

@Controller('scraper')
export class ScraperController {
  baseUrl: string;
  constructor(
    private readonly configService: ConfigService<Configuration>,
    private readonly httpClient: InternalHttpClientService,
  ) {
    this.httpClient.setName('authService');
    this.baseUrl = this.configService.get('serviceUrl').scraperUrl;
  }

  @Get()
  async getScraper() {
    return this.httpClient.forwardFromRequest(this.baseUrl + '/scraper', 'GET');
  }

  @Post()
  postScraper() {
    return this.httpClient.forwardFromRequest(
      this.baseUrl + '/scraper',
      'POST',
    );
  }

  @Get(':id/detail')
  getDetailScraper() {
    return this.httpClient.forwardFromRequest(
      this.baseUrl + '/scraper/detail',
      'GET',
    );
  }
}
