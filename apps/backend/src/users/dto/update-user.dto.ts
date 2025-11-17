import { IsOptional, IsString } from 'class-validator';
import { Gender } from '../entities/user.entity';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;
  @IsString()
  @IsOptional()
  password?: string;
  @IsString()
  @IsOptional()
  gender?: Gender;
  @IsString()
  @IsOptional()
  dob?: string;
  @IsString()
  @IsOptional()
  bio?: string;
  @IsString()
  @IsOptional()
  currentPassword?: string;
  @IsString()
  @IsOptional()
  newPassword?: string;
}
