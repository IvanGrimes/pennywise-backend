import { AccountsModule } from '@modules/accounts';
import { DatabaseModule } from '@modules/database';
import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { transactionsProviders } from './transactions.providers';

@Module({
  imports: [DatabaseModule, AccountsModule],
  providers: [...transactionsProviders, TransactionsService],
  controllers: [TransactionsController],
})
export class TransactionsModule {}
