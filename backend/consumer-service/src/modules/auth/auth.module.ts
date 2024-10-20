import { Global, Module } from '@nestjs/common';
import { HttpModule } from 'node-common';
import { AuthService } from './services';

@Global()
@Module({
  imports: [HttpModule],
  controllers: [],
  exports: [AuthService],
  providers: [AuthService],
})
export class AuthModule {}
