import { EntityBase } from '@lib/entity.base';
import { AccountEntity } from '@modules/accounts';
import { CategoryEntity } from '@modules/categories';
import { Column, Entity, ManyToOne } from 'typeorm';
import { TransactionEntityTypeEnum } from './transactions.types';

@Entity('transactions')
export class TransactionEntity extends EntityBase {
  @Column({
    type: 'enum',
    enum: TransactionEntityTypeEnum,
    default: TransactionEntityTypeEnum.Outcome,
  })
  type!: TransactionEntityTypeEnum;

  @Column({ type: 'float' })
  amount!: number;

  @Column({ nullable: true })
  description?: string;

  @ManyToOne(
    'AccountEntity',
    (account: AccountEntity) => account.transactions,
    { cascade: ['update', 'insert'], eager: true },
  )
  account!: AccountEntity;

  @ManyToOne(
    'CategoryEntity',
    (category: CategoryEntity) => category.transactions,
    { cascade: ['update', 'insert'] },
  )
  category!: CategoryEntity;
}
