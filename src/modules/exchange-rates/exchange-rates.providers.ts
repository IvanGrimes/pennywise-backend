import { exchangeRatesRepositoryDi } from './exchange-rates.di';
import { DataSource } from 'typeorm';
import { ExchangeRatesEntity } from './exchange-rates.entity';
import { AppDataSourceDi } from '@modules/database';

export const exchangeRatesProviders = [
  {
    provide: exchangeRatesRepositoryDi,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ExchangeRatesEntity),
    inject: [AppDataSourceDi],
  },
];
