import { EntityBase } from '@lib/entity.base';
import { AccountEntity } from '@modules/accounts';
import { Column, Entity, ManyToOne } from 'typeorm';
import { TransactionEntityTypeEnum } from './transactions.types';

@Entity('transactions')
export class TransactionEntity extends EntityBase {
  @Column({
    type: 'enum',
    enum: TransactionEntityTypeEnum,
    default: TransactionEntityTypeEnum.Outcome,
  })
  type!: string;

  @Column({ type: 'float' })
  amount!: number;

  @Column({ nullable: true })
  description?: string;

  @ManyToOne(
    'AccountEntity',
    (account: AccountEntity) => account.transactions,
    { cascade: ['update', 'insert'] },
  )
  account!: AccountEntity;
}