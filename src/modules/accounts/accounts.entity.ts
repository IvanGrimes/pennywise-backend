import { EntityBase } from '@lib/entity.base';
import { TransactionEntity } from '@modules/transactions';
import { UserEntity } from '@modules/user';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import {
  AccountCurrencyEnum,
  AccountIconEnum,
  AccountTypeEnum,
} from './accounts.types';

@Entity('accounts')
export class AccountEntity extends EntityBase {
  @Column({ type: 'enum', enum: AccountTypeEnum })
  type!: AccountTypeEnum;

  @Column()
  name!: string;

  @Column({ type: 'enum', enum: AccountIconEnum })
  icon!: string;

  @Column({ type: 'float' })
  balance!: number;

  @Column()
  isDefault!: boolean;

  @Column({ type: 'enum', enum: AccountCurrencyEnum })
  currency!: string;

  @OneToMany(
    'TransactionEntity',
    (transaction: TransactionEntity) => transaction.account,
    { nullable: true, cascade: true },
  )
  @JoinColumn()
  transactions!: TransactionEntity[];

  @ManyToOne('UserEntity', (user: UserEntity) => user.accounts)
  user!: UserEntity;
}
