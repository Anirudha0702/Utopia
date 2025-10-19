import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDTO } from './dto/auth.dto';

@Controller('auth') // Base route: /auth
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /auth/signup
  @Post('signup')
  async register(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    payload: SignupDTO,
  ) {
    return await this.authService.signup(payload);
  }
  // POST /auth/login
  @Post('login')
  async login(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {}
}
