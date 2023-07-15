import { EntityBase } from '@lib/entity.base';
import { TransactionEntity } from '@modules/transactions';
import { UserEntity } from '@modules/user';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity('accounts')
export class AccountEntity extends EntityBase {
  @Column()
  name!: string;

  @Column({ type: 'float' })
  balance!: number;

  @OneToMany(
    'TransactionEntity',
    (transaction: TransactionEntity) => transaction.account,
    { nullable: true, cascade: true },
  )
  transactions!: TransactionEntity[];

  @ManyToOne('UserEntity', (user: UserEntity) => user.accounts)
  user!: UserEntity;
}
