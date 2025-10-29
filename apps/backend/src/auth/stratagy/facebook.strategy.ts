// facebook.strategy.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';

import { Profile as FacebookProfile } from 'passport-facebook';
@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('META_APP_ID')!,
      clientSecret: configService.get<string>('META_APP_SECRET')!,
      callbackURL: 'http://localhost:3000/auth/facebook/callback',
      profileFields: ['id', 'emails', 'name', 'picture.type(large)'],
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: FacebookProfile,
    done: (err: any, user: any, info?: any) => void,
  ) {
    const { name, emails, photos } = profile;
    if (!name || !emails || !photos) done('info not found', false);
    else {
      const user = {
        email: emails[0].value,
        firstName: name.givenName,
        lastName: name.familyName,
        picture: photos[0].value,
        accessToken,
      };
      done(null, user);
    }
  }
}
