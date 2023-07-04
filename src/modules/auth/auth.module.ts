import { Module } from '@nestjs/common';
import { UserModule } from '@modules/user';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies';
import { PassportModule } from '@nestjs/passport';
import { EmailVerificationModule } from 'src/modules/email-verification';

@Module({
  imports: [
    UserModule,
    JwtModule.register({}),
    PassportModule,
    EmailVerificationModule,
  ],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
