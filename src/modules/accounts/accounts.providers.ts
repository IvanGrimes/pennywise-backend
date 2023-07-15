import { accountsRepositoryDi } from './accounts.di';
import { DataSource } from 'typeorm';
import { AccountEntity } from './accounts.entity';
import { AppDataSourceDi } from '@modules/database';

export const accountsProviders = [
  {
    provide: accountsRepositoryDi,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(AccountEntity),
    inject: [AppDataSourceDi],
  },
];
