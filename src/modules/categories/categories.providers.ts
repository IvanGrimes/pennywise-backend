import { categoriesRepositoryDi } from './categories.di';
import { DataSource } from 'typeorm';
import { CategoryEntity } from './categories.entity';
import { AppDataSourceDi } from '@modules/database';

export const transactionsProviders = [
  {
    provide: categoriesRepositoryDi,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(CategoryEntity),
    inject: [AppDataSourceDi],
  },
];
