import { Injectable } from '@nestjs/common';
import { UserService } from '@modules/user';
import { SignUpRequestDto, SignInRequestDto } from './dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './auth.types';
import {
  RefreshTokenNotFoundOrExpired,
  WrongCredentialsError,
  WrongRefreshToken,
} from './auth.error';
import * as argon from 'argon2';
import { UserEntity } from '@modules/user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpRequestDto) {
    const user = await this.userService.create({
      ...signUpDto,
      password: await argon.hash(signUpDto.password),
    });
    const tokens = await this.getTokens(user);

    await this.userService.updateRefreshToken({
      id: user.id,
      refreshToken: tokens.refreshToken,
    });

    return tokens;
  }

  async signIn(signInDto: SignInRequestDto) {
    const user = await this.userService.findByEmail(signInDto);
    const passwordMatches = await this.userService.verifyHashedValue(
      user.password,
      signInDto.password,
    );

    if (!passwordMatches) throw new WrongCredentialsError();

    const tokens = await this.getTokens(user);

    await this.userService.updateRefreshToken({
      id: user.id,
      refreshToken: tokens.refreshToken,
    });

    return tokens;
  }

  async refresh({
    userId,
    refreshToken,
  }: {
    userId: number;
    refreshToken: string;
  }) {
    const user = await this.userService.find({ id: userId });

    if (!user.refreshToken || !refreshToken)
      throw new RefreshTokenNotFoundOrExpired();

    const refreshTokenMatches = await this.userService.verifyHashedValue(
      user.refreshToken,
      refreshToken,
    );

    if (!refreshTokenMatches) throw new WrongRefreshToken();

    const tokens = await this.getTokens(user);

    await this.userService.updateRefreshToken({
      id: user.id,
      refreshToken: tokens.refreshToken,
    });

    return tokens;
  }

  async signOut({ id }: { id: number }) {
    await this.userService.removeRefreshToken({ id });
  }

  private async getTokens({ id, email, firstName, lastName }: UserEntity) {
    const jwtPayload: JwtPayload = {
      sub: id,
      email,
      firstName,
      lastName,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
