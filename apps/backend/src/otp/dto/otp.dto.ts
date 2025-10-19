import { IsEmail, MinLength } from 'class-validator';

export class CreateOtpDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  username?: string;
}

export class VerifyOtpDto {
  @IsEmail({}, { message: 'Invalid Email formal' })
  email: string;
  @MinLength(6, { message: 'OTP must be 6 characters long' })
  otp: string;
}
