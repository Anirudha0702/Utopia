import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { OtpService } from './otp.service';
import { CreateOtpDto, VerifyOtpDto } from './dto/otp.dto';
import { EmailService } from 'src/email/email.service';

@Controller('otp')
export class OtpController {
  constructor(
    private readonly otpService: OtpService,
    private readonly emailService: EmailService,
  ) {}

  @Post('/generate')
  async generate(
    @Body(new ValidationPipe({ whitelist: true, transform: true }))
    info: CreateOtpDto,
  ) {
    const { otp, otpEntry } = await this.otpService.generate(info);

    await this.emailService.sentOTPTo(info.email, otp, info.username);
    return otpEntry;
  }

  @Post('/verify')
  async verify(
    @Body(new ValidationPipe({ whitelist: true, transform: true }))
    info: VerifyOtpDto,
  ) {
    const verified = await this.otpService.verify(info);
    if (verified)
      return {
        verified,
        email: info.email,
      };
  }
}
