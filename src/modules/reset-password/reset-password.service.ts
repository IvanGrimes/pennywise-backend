import { Injectable } from '@nestjs/common';
import { ResetPasswordTokenPayload } from './reset-password.types';
import { EmailService } from '@modules/email';
import { UserService } from '@modules/user';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ResetPasswordRequestDto, SetPasswordRequestDto } from './dto';
import {
  BadResetPasswordTokenError,
  ResetPasswordTokenExpiredError,
} from './reset-password.errors';

@Injectable()
export class ResetPasswordService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly userService: UserService,
  ) {}

  private readonly resetPasswordTokenSecret = this.configService.get(
    'RESET_PASSWORD_TOKEN_SECRET',
  );

  async sendResetLink({ email }: ResetPasswordRequestDto) {
    const payload: ResetPasswordTokenPayload = { email };
    const token = this.jwtService.sign(payload, {
      secret: this.resetPasswordTokenSecret,
      expiresIn: this.configService.get('RESET_PASSWORD_TOKEN_EXPIRATION_TIME'),
    });
    const url = `${this.configService.get('SET_PASSWORD_URL')}?token=${token}`;
    const text = `To reset the password, click here: ${url}`;

    await this.userService.setResetPasswordToken({ email, token });

    return this.emailService.send({
      to: email,
      subject: 'Password reset',
      text,
    });
  }

  async setPassword({ token, password }: SetPasswordRequestDto) {
    const { email } = await this.decodeResetPasswordToken(token);

    return this.userService.setPassword({ email, password });
  }

  private decodeResetPasswordToken(token: string) {
    try {
      return this.jwtService.verify<ResetPasswordTokenPayload>(token, {
        secret: this.resetPasswordTokenSecret,
      });
    } catch (error) {
      if (error instanceof Error && error?.name === 'TokenExpiredError') {
        throw new ResetPasswordTokenExpiredError();
      }

      throw new BadResetPasswordTokenError();
    }
  }
}
