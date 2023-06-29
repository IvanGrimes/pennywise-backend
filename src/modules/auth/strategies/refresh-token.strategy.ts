import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request as RequestType } from 'express';
import { refreshTokenCookie } from '@src/const/refreshTokenCookie';
import { JwtPayload } from '@modules/auth';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        RefreshTokenStrategy.extract,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: config.get<string>('REFRESH_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }

  private static extract(req: RequestType): string | null {
    if (
      req.signedCookies &&
      refreshTokenCookie in req.signedCookies &&
      req.signedCookies[refreshTokenCookie].length > 0
    ) {
      return req.signedCookies[refreshTokenCookie];
    }

    return null;
  }

  validate(req: RequestType, payload: JwtPayload) {
    const refreshToken = RefreshTokenStrategy.extract(req);

    console.log(refreshToken, payload);

    if (!refreshToken)
      throw new UnauthorizedException('Refresh token not found');

    return { ...payload, refreshToken };
  }
}
