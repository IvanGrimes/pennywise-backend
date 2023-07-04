import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '@modules/email';
import { VerificationTokenPayload } from './email-verification.types';
import {
  BadVerificationTokenError,
  EmailAlreadyVerifiedError,
  VerificationTokenExpiredError,
} from './email-verification.errors';
import { UserService } from '@modules/user';

@Injectable()
export class EmailVerificationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly userService: UserService,
  ) {}

  private readonly verificationTokenSecret = this.configService.get(
    'VERIFICATION_TOKEN_SECRET',
  );

  sendVerificationLink(email: string) {
    const payload: VerificationTokenPayload = { email };
    const token = this.jwtService.sign(payload, {
      secret: this.verificationTokenSecret,
      expiresIn: this.configService.get('VERIFICATION_TOKEN_EXPIRATION_TIME'),
    });
    const url = `${this.configService.get(
      'EMAIL_CONFIRMATION_URL',
    )}?token=${token}`;
    const text = `Welcome to the application. To confirm the email address, click here: ${url}`;

    return this.emailService.send({
      from: this.configService.get('EMAIL_USER'),
      to: email,
      subject: 'Email confirmation',
      text,
    });
  }

  async verifyEmail(email: string) {
    const user = await this.userService.findByEmail({ email });

    if (user.isEmailVerified) {
      throw new EmailAlreadyVerifiedError();
    }

    await this.userService.markEmailAsVerified(email);
  }

  async resendVerificationLink(userId: number) {
    const user = await this.userService.find({ id: userId });

    if (user.isEmailVerified) {
      throw new EmailAlreadyVerifiedError();
    }

    await this.sendVerificationLink(user.email);
  }

  async decodeConfirmationToken(token: string) {
    try {
      const payload = await this.jwtService.verify<VerificationTokenPayload>(
        token,
        {
          secret: this.verificationTokenSecret,
        },
      );

      return payload.email;
    } catch (error) {
      if (error instanceof Error && error?.name === 'TokenExpiredError') {
        throw new VerificationTokenExpiredError();
      }

      throw new BadVerificationTokenError();
    }
  }
}
