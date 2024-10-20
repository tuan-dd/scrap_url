import { ExecutionContext, Injectable } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RfAuthGuard extends AuthGuard('rf') {
  canActivate(ctx: ExecutionContext) {
    return super.canActivate(ctx);
  }
}
