import { Module } from '@nestjs/common';
import { DatabaseModule } from '@modules/database';
import { userProviders } from './user.providers';
import { UserService } from './user.service';

const providers = [...userProviders, UserService];

@Module({
  imports: [DatabaseModule],
  providers,
  controllers: [],
  exports: providers,
})
export class UserModule {}
