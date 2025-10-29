import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateOtpDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsOptional()
  @IsString()
  username?: string;
}

export class VerifyOtpDto {
  @IsEmail({}, { message: 'Invalid Email formal' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'OTP must be 6 characters long' })
  otp: string;
}
