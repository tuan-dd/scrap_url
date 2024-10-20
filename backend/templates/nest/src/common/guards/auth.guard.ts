import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Scope,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AUTHORIZE } from '../constants';
import { AuthService } from '@module/auth';

@Injectable({ scope: Scope.REQUEST })
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isGlobal = !this.reflector.get(AUTHORIZE, context.getHandler());
    if (isGlobal) return true;
    await this.authService.verify();

    return true;
  }
}
