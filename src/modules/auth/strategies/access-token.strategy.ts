import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../auth.types';
import { SessionNotFoundError, SessionService } from '@modules/session';
import { Request } from 'express';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly sessionService: SessionService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('ACCESS_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const [, accessToken = ''] =
      req.headers.authorization?.split('Bearer ') ?? [];
    try {
      const session = await this.sessionService.find({
        userId: payload.sub,
        accessToken,
      });

      if (session.isRevoked) {
        throw new UnauthorizedException('Session is revoked');
      }

      return payload;
    } catch (e) {
      if (e instanceof SessionNotFoundError) {
        throw new UnauthorizedException(SessionNotFoundError.message);
      }

      throw e;
    }
  }
}
