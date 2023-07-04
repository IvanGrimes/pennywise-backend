import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { EmailVerificationService } from './email-verification.service';
import { EmailModule } from '@modules/email';
import { UserModule } from '@modules/user';
import { EmailVerificationController } from './email-verification.controller';

@Module({
  imports: [EmailModule, JwtModule.register({}), UserModule],
  providers: [EmailVerificationService],
  controllers: [EmailVerificationController],
  exports: [EmailVerificationService],
})
export class EmailVerificationModule {}
