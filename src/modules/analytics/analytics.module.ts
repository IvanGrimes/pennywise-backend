import { AccountsModule } from '@modules/accounts';
import { CategoriesModule } from '@modules/categories';
import { ExchangeRatesModule } from '@modules/exchange-rates';
import { UserService } from '@modules/user';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [CategoriesModule, ExchangeRatesModule],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
