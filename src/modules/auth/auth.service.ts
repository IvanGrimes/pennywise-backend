import { Injectable } from '@nestjs/common';
import { UserService, UserEntity } from '@modules/user';
import { SignUpRequestDto, SignInRequestDto } from './dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './auth.types';
import {
  RefreshTokenNotFoundError,
  WrongCredentialsError,
  WrongRefreshTokenError,
} from './auth.error';
import { SessionService } from '@modules/session';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly sessionService: SessionService,
  ) {}

  async signUp(signUpDto: SignUpRequestDto) {
    const user = await this.userService.create(signUpDto);
    const tokens = await this.getTokens(user);

    await this.sessionService.create(user, tokens);

    return tokens;
  }

  async signIn(signInDto: SignInRequestDto) {
    const user = await this.userService.findByEmail(signInDto);
    const passwordMatches = await this.userService.verifyHashedValue(
      user.password,
      signInDto.password,
    );

    if (!passwordMatches) throw new WrongCredentialsError();

    const tokens = await this.getTokens(user, signInDto.remember);

    await this.sessionService.create(user, tokens);

    return tokens;
  }

  async refresh({
    userId,
    accessToken,
    refreshToken,
  }: {
    userId: number;
    accessToken: string;
    refreshToken: string;
  }) {
    const session = await this.sessionService.find({
      userId,
      accessToken,
    });

    if (!session.refreshToken) throw new RefreshTokenNotFoundError();
    if (session.refreshToken !== refreshToken || session.isRevoked)
      throw new WrongRefreshTokenError();

    const user = await this.userService.find({ id: session.user.id });
    const tokens = await this.getTokens(user);

    await this.sessionService.update({
      id: session.id,
      accessToken: tokens.accessToken,
    });

    return tokens;
  }

  async signOut({ accessToken }: { accessToken: string }) {
    await this.sessionService.revokeByAccessToken(accessToken);
  }

  private async getTokens(
    { id, email, firstName, lastName }: UserEntity,
    createRefreshToken = true,
  ) {
    const jwtPayload: JwtPayload = {
      sub: id,
      email,
      firstName,
      lastName,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
        expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRATION_TIME'),
      }),
      createRefreshToken
        ? this.jwtService.signAsync(jwtPayload, {
            secret: this.configService.get('REFRESH_TOKEN_SECRET'),
            expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRATION_TIME'),
          })
        : Promise.resolve(undefined),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
