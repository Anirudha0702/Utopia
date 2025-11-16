import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Res,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDTO, SignupDTO } from './dto/auth.dto';
import { type Request, type Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
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
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    credential: SigninDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.signin(credential, res);
  }
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Redirects to Google OAuth login
  }
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req: Request) {
    return req.user; // User info from Google
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuth() {}

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  facebookAuthRedirect(@Req() req: Request) {
    return req.user;
  }
  @Get('get-token')
  GenerateAccessToken(@Req() req: Request) {
    return this.authService.GenerateAccessToken(req);
  }
  @Get('me')
  async me(@Req() req: Request) {
    return await this.authService.me(req);
  }
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refreshToken');
    return { message: 'Logged out successfully' };
  }
}
