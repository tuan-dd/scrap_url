import { Injectable, Scope } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { BaseService } from 'node-common';
import { prisma } from 'src/database';

@Injectable({ scope: Scope.REQUEST })
export class ScrapeService extends BaseService<PrismaClient['scrape']> {
  userScrape: PrismaClient['userScrape'];
  media: PrismaClient['media'];
  constructor() {
    super(prisma.scrape);
  }

  override async joinTransaction(client: PrismaClient['scrape'], tx: any) {
    this.client = client;
    this.userScrape = tx.userScrape;
    this.media = tx.media;
  }

  async createScrape(data: any) {
    prisma.$transaction(async (tx) => {
      this.joinTransaction(tx.scrape, tx);
    });
  }
}
