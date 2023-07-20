import { EntityBase } from '@lib/entity.base';
import { TransactionEntity } from '@modules/transactions';
import { UserEntity } from '@modules/user';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity('categories')
export class CategoryEntity extends EntityBase {
  @Column()
  name!: string;

  @Column()
  color!: string;

  @OneToMany(
    'TransactionEntity',
    (transaction: TransactionEntity) => transaction.category,
    { nullable: true },
  )
  transactions?: TransactionEntity[];

  @ManyToOne('UserEntity', (user: UserEntity) => user.categories)
  user!: UserEntity;
}
