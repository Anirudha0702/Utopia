import { Injectable } from '@nestjs/common';
import { CreateOtpDto, VerifyOtpDto } from './dto/otp.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OTP } from './entities/otp.entity';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(OTP)
    private readonly OtpRepository: Repository<OTP>,
  ) {}
  async generate(info: CreateOtpDto) {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let otp = '';
    for (let i = 0; i < 6; i++) {
      otp += characters.charAt(crypto.randomInt(0, characters.length));
    }

    const otpHash = await bcrypt.hash(otp, 10);

    let otpEntry = await this.OtpRepository.findOne({
      where: { email: info.email },
    });
    if (otpEntry) {
      otpEntry.otpHash = otpHash;
      otpEntry.expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    } else {
      otpEntry = this.OtpRepository.create({
        email: info.email,
        otpHash,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      });
    }

    // 4. Save to DB
    otpEntry = await this.OtpRepository.save(otpEntry);

    return { otp, otpEntry };
  }
  async verify(info: VerifyOtpDto) {}
}
