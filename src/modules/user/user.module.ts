import { Module } from '@nestjs/common';
import { DatabaseModule } from '@modules/database';
import { userProviders } from './user.providers';
import { UserService } from './user.service';
import { UserController } from './user.controller';

const providers = [...userProviders, UserService];

@Module({
  imports: [DatabaseModule],
  providers,
  controllers: [UserController],
  exports: providers,
})
export class UserModule {}
