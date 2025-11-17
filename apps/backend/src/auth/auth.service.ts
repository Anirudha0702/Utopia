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
import { Response, Request } from 'express';
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
        throw new UnauthorizedException('Invalid Credentials');
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

      res.cookie('utopia_refreshToken', refreshToken, {
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
  async oauthSignIn() {}

  GenerateAccessToken(req: Request) {
    try {
      const cookies = req.cookies as Record<string, string>;
      const refreshToken = cookies?.utopia_refreshToken;
      if (!refreshToken)
        throw new UnauthorizedException('Invalid token format');
      const { id, email, name, privacy } = this.jwt.verifyToken<{
        id: string;
        email: string;
        name: string;
        privacy: string;
      }>(refreshToken);
      const accessToken = this.jwt.createToken(
        { id, email, name, privacy },
        'access',
        60 * 5,
      );
      return { token: accessToken };
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(
        error instanceof Error ? error.message : 'An unexpected error occurred',
      );
    }
  }
  async me(req: Request) {
    try {
      const authHeader = req.headers['authorization'];
      const cookies = req.cookies as Record<string, string>;
      const refreshToken = cookies?.utopia_refreshToken;
      if (!authHeader && !refreshToken)
        throw new UnauthorizedException('No token provided');
      let token: string | undefined;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      } else if (refreshToken) {
        token = refreshToken;
      }
      if (!token) throw new UnauthorizedException('Invalid token format');
      const { id, email, name, privacy } = this.jwt.verifyToken<{
        id: string;
        email: string;
        name: string;
        privacy: string;
      }>(token);
      const user = await this.userService.findOneById(id);
      if (!user) throw new UnauthorizedException('User not found');
      const accessToken = this.jwt.createToken(
        { id, email, name, privacy },
        'access',
        60 * 5,
      );
      return {
        token: accessToken,
        user: {
          id,
          email,
          name,
          privacy,
          profilePicture: user?.profilePicture,
          coverPicture: user?.coverPicture,
        },
      };
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(
        error instanceof Error ? error.message : 'An unexpected error occurred',
      );
    }
  }
}
