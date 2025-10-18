import { HttpException, Injectable } from '@nestjs/common';
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
      const user = await this.userService.create(userInfo);
      return user;
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }
}
