import { sessionRepositoryDi } from './session.di';
import { DataSource } from 'typeorm';
import { SessionEntity } from './session.entity';
import { AppDataSourceDi } from '@modules/database';

export const sessionProviders = [
  {
    provide: sessionRepositoryDi,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(SessionEntity),
    inject: [AppDataSourceDi],
  },
];
