import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { JwtStrategy } from 'src/global/strategy';

import { TokenService } from './token.service';

@Global()
@Module({
  imports: [JwtModule.register({})],
  providers: [TokenService, JwtStrategy],
  exports: [TokenService],
})
export class TokenModule {}
