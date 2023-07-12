import {
  Body,
  Controller,
  Get,
  HttpCode,
  Headers,
  Param,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ResetPasswordService } from './reset-password.service';
import {
  ForgotPasswordDto,
  ResetPasswordDto,
  ResetPasswordParamsDto,
} from './dtos';

@Controller('auth')
@ApiTags('Auth')
export class ResetPasswordController {
  constructor(private readonly resetPasswordService: ResetPasswordService) {}

  @Post('forgot-password')
  @HttpCode(200)
  forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
    @Headers('origin') origin: string,
  ) {
    return this.resetPasswordService.forgotPassword(forgotPasswordDto, origin);
  }

  @Get('reset-password/:userId/:token')
  checkResetLink(@Param() resetParams: ResetPasswordParamsDto) {
    return this.resetPasswordService.checkResetLink(resetParams);
  }

  @Post('reset-password/:userId/:token')
  @HttpCode(200)
  resetPassword(
    @Param() resetParams: ResetPasswordParamsDto,
    @Body() resetBody: ResetPasswordDto,
  ) {
    return this.resetPasswordService.resetPassword(resetParams, resetBody);
  }
}
