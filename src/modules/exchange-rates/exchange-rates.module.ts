import { DatabaseModule } from '@modules/database';
import { Module } from '@nestjs/common';
import { ExchangeRatesService } from './exchange-rates.service';
import { exchangeRatesProviders } from './exchange-rates.providers';

@Module({
  imports: [DatabaseModule],
  providers: [...exchangeRatesProviders, ExchangeRatesService],
  exports: [ExchangeRatesService],
})
export class ExchangeRatesModule {}
