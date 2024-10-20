import { Injectable, Scope } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AslRequestContext, BaseService, ERROR_MSG } from 'node-common';
import { prisma } from '@db/services';
@Injectable({ scope: Scope.REQUEST })
export class UserService extends BaseService<PrismaClient['user']> {
  constructor() {
    super(prisma.user);
  }

  async me() {
    const userId = AslRequestContext.ctx?.userInfo?.userId;

    if (!userId) {
      return ERROR_MSG.BAD_USER_INPUT('User not found');
    }
    return this.client.findFirst({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        phone: true,
        dateOfBirth: true,
        status: true,
      },
    });
  }
}
