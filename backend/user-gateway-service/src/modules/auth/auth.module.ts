import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';

import { JwtAuthGuard } from './guards/auth.guard';
import { RefreshStrategy } from './strategy/refresh.strategy';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { HttpModule } from 'node-common';

@Module({
  imports: [HttpModule],
  controllers: [AuthController],
  providers: [JwtAuthGuard, RefreshStrategy, AuthService, JwtStrategy],
})
export class AuthModule {}
