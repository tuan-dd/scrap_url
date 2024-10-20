import { Global, Module } from '@nestjs/common';
import { AuthService } from './services';
import { AuthController } from './auth.controller';

@Global()
@Module({
  imports: [],
  controllers: [AuthController],
  exports: [AuthService],
  providers: [AuthService],
})
export class AuthModule {}
