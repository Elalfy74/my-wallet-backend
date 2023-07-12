import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { ResetPasswordController } from './reset-password.controller';
import { ResetPasswordService } from './reset-password.service';
import { SendGridModule } from 'src/global/modules/sendgrid/sendgrid.module';

@Module({
  imports: [SendGridModule],
  controllers: [AuthController, ResetPasswordController],
  providers: [AuthService, ResetPasswordService],
})
export class AuthModule {}
