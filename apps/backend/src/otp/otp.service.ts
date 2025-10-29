import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateOtpDto, VerifyOtpDto } from './dto/otp.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OTP } from './entities/otp.entity';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { hash, matchHash } from 'src/utils/security';
@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(OTP)
    private readonly OtpRepository: Repository<OTP>,
  ) {}
  async generate(info: CreateOtpDto) {
    try {
      const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let otp = '';
      for (let i = 0; i < 6; i++) {
        otp += characters.charAt(crypto.randomInt(0, characters.length));
      }

      const otpHash = await hash(otp, 10);

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
      otpEntry = await this.OtpRepository.save(otpEntry);

      return { otp, otpEntry };
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException(
        error instanceof Error ? error.message : 'An unexpected error occurred',
      );
    }
  }

  async getOTPEntry(email: string): Promise<OTP | null> {
    const entry = await this.OtpRepository.findOne({
      where: { email: email },
    });
    return entry;
  }

  async verify(info: VerifyOtpDto) {
    try {
      const entry = await this.getOTPEntry(info.email);
      if (!entry) throw new NotFoundException('No OTP found for this email');
      const expiresAt = new Date(entry.expiresAt);
      const now = new Date();

      if (now > expiresAt) {
        throw new BadRequestException('OTP has expired');
      }

      const verified = await matchHash(info.otp, entry.otpHash);
      if (!verified) {
        throw new BadRequestException('Invalid OTP');
      }

      await this.OtpRepository.delete({ email: info.email });
      return verified;
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException(
        error instanceof Error ? error.message : 'An unexpected error occurred',
      );
    }
  }
}
