import { DatabaseModule } from '@modules/database';
import { UserModule } from '@modules/user';
import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { accountsProviders } from './accounts.providers';

@Module({
  imports: [DatabaseModule, UserModule],
  controllers: [AccountsController],
  providers: [...accountsProviders, AccountsService],
  exports: [AccountsService],
})
export class AccountsModule {}
