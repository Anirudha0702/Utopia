import { Gender } from '../entities/user.entity';

export class UpdateUserDto {
  name?: string;
  password?: string;
  gender?: Gender;
  dateOfBirth?: string;
  bio?: string;
  currentPassword?: string;
  newPassword?: string;
}
