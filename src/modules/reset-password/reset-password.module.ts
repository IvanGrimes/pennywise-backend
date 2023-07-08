import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { EmailModule } from '@modules/email';
import { UserModule } from '@modules/user';
import { ResetPasswordController } from './reset-password.controller';
import { ResetPasswordService } from './reset-password.service';

@Module({
  imports: [EmailModule, JwtModule.register({}), UserModule],
  providers: [ResetPasswordService],
  controllers: [ResetPasswordController],
})
export class ResetPasswordModule {}
