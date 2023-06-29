import { AppDataSourceDi } from './database.di';
import { DataSource } from 'typeorm';
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Environment } from '@src/const/Environment';

export const databaseProviders: Provider[] = [
  {
    provide: AppDataSourceDi,
    useFactory: (configService: ConfigService) => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') === Environment.development,
        logging: configService.get('NODE_ENV') === Environment.development,
        extra: { charset: 'utf8mb4_unicode_ci' },
      });

      return dataSource.initialize();
    },
    inject: [ConfigService],
  },
];
