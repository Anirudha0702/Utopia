import {
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import {
  TransactionalEmailsApi,
  SendSmtpEmail,
  TransactionalEmailsApiApiKeys,
} from '@getbrevo/brevo';
import { OTPSentTemplate } from './templates/otp.template';

@Injectable()
export class EmailService implements OnModuleInit {
  private apiInstance: TransactionalEmailsApi;

  onModuleInit() {
    this.apiInstance = new TransactionalEmailsApi();
    this.apiInstance.setApiKey(
      TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY!,
    );
  }

  async sentOTPTo(email: string, otp: string, username?: string) {
    try {
      const message = new SendSmtpEmail();
      const htmlContent = OTPSentTemplate(username ?? 'User', otp);
      message.subject = 'Email Verification';
      message.htmlContent = htmlContent;
      message.sender = {
        name: 'Neko Team',
        email: 'nekoteam.meow@gmail.com',
      };
      message.to = [{ email: email, name: username ?? 'User' }];
      await this.apiInstance.sendTransacEmail(message);
      return 'email sent successfully';
    } catch (error) {
      console.error('Error sending email:', error);
      throw new InternalServerErrorException('error while sending email');
    }
  }
}
