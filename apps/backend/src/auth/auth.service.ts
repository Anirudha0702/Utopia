import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { SignupDTO } from './dto/auth.dto';
import { UserService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
  signin() {
    return 'signedin';
  }
  async signup(userInfo: SignupDTO): Promise<User> {
    try {
      const existing = await this.userService.findOneByEmail(userInfo.email);
      if (existing)
        throw new ConflictException('This email is already registered');
      const user = await this.userService.create(userInfo);

      return user;
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException(
        error instanceof Error ? error.message : 'An unexpected error occurred',
      );
    }
  }
}
