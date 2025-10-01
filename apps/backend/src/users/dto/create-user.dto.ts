export class CreateUserDto {
  name: string;
  email: string;
  password: string;
  age?: number;
  dateOfBirth?: string;
  profilePicture?: string; // optional
}
