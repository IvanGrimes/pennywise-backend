import { UserModule } from '@modules/user';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { DatabaseModule } from '@modules/database';
import { Module } from '@nestjs/common';
import { transactionsProviders } from './categories.providers';

@Module({
  imports: [DatabaseModule, UserModule],
  controllers: [CategoriesController],
  providers: [...transactionsProviders, CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
