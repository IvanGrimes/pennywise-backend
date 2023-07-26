import { AccountsModule } from '@modules/accounts';
import { CategoriesModule } from '@modules/categories';
import { DatabaseModule } from '@modules/database';
import { ExchangeRatesModule } from '@modules/exchange-rates';
import { UserModule } from '@modules/user';
import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { transactionsProviders } from './transactions.providers';

@Module({
  imports: [
    DatabaseModule,
    AccountsModule,
    CategoriesModule,
    ExchangeRatesModule,
    UserModule,
  ],
  providers: [...transactionsProviders, TransactionsService],
  controllers: [TransactionsController],
})
export class TransactionsModule {}
