import { Injectable, UnauthorizedException } from '@nestjs/common';
import { hash } from 'bcryptjs';
import { MailDataRequired } from '@sendgrid/mail';
import { ConfigService } from '@nestjs/config';

import { PrismaService } from 'src/global/modules/prisma/prisma.service';
import { TokenService } from 'src/global/modules/token/token.service';
import { SendGridService } from 'src/global/modules/sendgrid/sendgrid.service';

import {
  ForgotPasswordDto,
  ResetPasswordDto,
  ResetPasswordParamsDto,
} from './dtos';

@Injectable()
export class ResetPasswordService {
  constructor(
    private prisma: PrismaService,
    private tokenService: TokenService,
    private sendGrid: SendGridService,
    private config: ConfigService,
  ) {}

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto, host: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: forgotPasswordDto.email,
      },
    });

    if (!user) throw new UnauthorizedException('Invalid Email address');

    const token = this.tokenService.signResetToken(
      {
        email: user.email,
        userId: user.id,
      },
      user.password,
    );

    const link = `${host}/${user.id}/${token}`;

    const mail: MailDataRequired = {
      to: user.email,
      subject: 'Password Recovery Email',
      from: this.config.get('FROM_EMAIL'),
      text: 'Hello',
      html: `<div><h1>Hello</h1><a href=${link}>Reset Password</div>`,
    };

    return this.sendGrid.send(mail);
  }

  async checkResetLink({ userId, token }: ResetPasswordParamsDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) throw new UnauthorizedException();

    const payload = this.tokenService.verifyResetToken(token, user.password);
    if (!payload) throw new UnauthorizedException();

    return payload;
  }

  async resetPassword(
    resetParams: ResetPasswordParamsDto,
    resetBody: ResetPasswordDto,
  ) {
    await this.checkResetLink(resetParams);

    const hashPassword = await hash(resetBody.password, 12);

    return this.prisma.user.update({
      where: {
        id: resetParams.userId,
      },
      data: {
        password: hashPassword,
      },
    });
  }
}
