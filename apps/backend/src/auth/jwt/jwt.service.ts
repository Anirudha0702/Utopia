import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  private readonly secretKey = process.env.JWT_SECRET_KEY || 'your_secret_key';
  private readonly algorithm: jwt.Algorithm = 'HS256';
  private readonly defaultExpiry = 60 * 60; // 1 hour

  // Create a JWT token
  createToken(
    payload: Record<string, any>,
    type: string,
    expiresInSeconds?: number,
  ): string {
    const expiresIn = expiresInSeconds ?? this.defaultExpiry;

    try {
      return jwt.sign({ ...payload, type }, this.secretKey, {
        algorithm: this.algorithm,
        expiresIn,
      });
    } catch (error: unknown) {
      throw new InternalServerErrorException(
        error instanceof Error ? error.message : 'An unexpected error occurred',
      );
    }
  }

  verifyToken<T = any>(token: string): T {
    try {
      return jwt.verify(token, this.secretKey) as T;
    } catch (err: unknown) {
      throw new InternalServerErrorException(
        err instanceof Error ? err.message : 'An unexpected error occurred',
      );
    }
  }
}
