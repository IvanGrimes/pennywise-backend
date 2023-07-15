import { transactionsRepositoryDi } from './transactions.di';
import { DataSource } from 'typeorm';
import { TransactionEntity } from './transactions.entity';
import { AppDataSourceDi } from '@modules/database';

export const transactionsProviders = [
  {
    provide: transactionsRepositoryDi,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(TransactionEntity),
    inject: [AppDataSourceDi],
  },
];
