// src/auth/dto/auth.dto.ts
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MinLength,
} from 'class-validator';
import { Gender, User } from 'src/users/entities/user.entity';

export class SignupDTO {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsBoolean()
  @IsOptional()
  verified?: boolean;
}

export class SigninDTO {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
export class InternalUser {
  id: string;
  email: string;
  name: string;
  profilePicture?: string;
  coverPicture?: string;
  bio?: string;
  dateOfBirth?: Date;
  isVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  privacy: 'Public' | 'Private' | 'Friends';
  gender: Gender;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.name = user.name;
    this.profilePicture = user.profilePicture;
    this.bio = user.bio;
    this.dateOfBirth = user.dateOfBirth;
    this.isVerified = user.isVerified;
    this.isActive = user.isActive;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
    this.lastLogin = user.lastLogin;
    this.privacy = user.privacy;
    this.coverPicture = user.coverPicture;
    this.gender = user.gender;
  }
}

export class LoginSuccessDTO {
  user: InternalUser;
  accessToken: string;
  refreshToken: string;
}
