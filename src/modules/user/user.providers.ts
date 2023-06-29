import { userRepositoryDi } from './user.di';
import { DataSource } from 'typeorm';
import { UserEntity } from './user.entity';
import { AppDataSourceDi } from '@modules/database';

export const userProviders = [
  {
    provide: userRepositoryDi,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(UserEntity),
    inject: [AppDataSourceDi],
  },
];
