import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as SendGrid from '@sendgrid/mail';

@Injectable()
export class SendGridService {
  constructor(private readonly config: ConfigService) {
    SendGrid.setApiKey(this.config.get<string>('SENDGRID_KEY'));
  }

  async send(mail: SendGrid.MailDataRequired) {
    await SendGrid.send(mail);

    return {
      message: 'Recovery mail has been sent, Please check your email',
    };
  }
}
