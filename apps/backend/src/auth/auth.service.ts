import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  InternalUser,
  LoginSuccessDTO,
  SigninDTO,
  SignupDTO,
} from './dto/auth.dto';
import { UserService } from 'src/users/users.service';
import { matchHash } from 'src/utils/security';
import { JwtService } from './jwt/jwt.service';
import { Response } from 'express';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwt: JwtService,
  ) {}

  async signup(userInfo: SignupDTO): Promise<InternalUser> {
    try {
      const existing = await this.userService.findOneByEmail(userInfo.email);
      if (existing)
        throw new ConflictException('This email is already registered');
      const user = await this.userService.create(userInfo);
      const extractedUser = new InternalUser(user);
      return extractedUser;
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException(
        error instanceof Error ? error.message : 'An unexpected error occurred',
      );
    }
  }
  async signin(cred: SigninDTO, res: Response): Promise<LoginSuccessDTO> {
    try {
      const existing = await this.userService.findOneByEmail(cred.email);
      if (!existing) throw new ConflictException('No user found on this email');

      const passwordMatched = await matchHash(cred.password, existing.password);
      if (!passwordMatched)
        throw new UnauthorizedException('INvalid Credentials');
      const payload = {
        email: existing.email,
        name: existing.name,
        id: existing.id,
        privacy: existing.privacy,
      };
      const accessToken = this.jwt.createToken(payload, 'access', 60 * 5);
      const refreshToken = this.jwt.createToken(
        payload,
        'refresh',
        60 * 60 * 24 * 30,
      );
      const user = new InternalUser(existing);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24 * 30,
      });
      return {
        accessToken,
        refreshToken,
        user,
      };
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException(
        error instanceof Error ? error.message : 'An unexpected error occurred',
      );
    }
  }

  async oauthSignIn(
    code: string,
    state: string,
    res: Response,
  ): Promise<string> {}
}
