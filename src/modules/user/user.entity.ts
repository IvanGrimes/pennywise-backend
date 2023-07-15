import { AccountEntity } from '@modules/accounts';
import { EntityBase } from '@src/lib/entity.base';
import { Column, Entity, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import type { SessionEntity } from '@modules/session';

@Entity({ name: 'users' })
export class UserEntity extends EntityBase {
  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  @Exclude()
  password!: string;

  @Column({ default: false })
  isEmailVerified!: boolean;

  @Column({ nullable: true })
  resetPasswordToken?: string;

  @OneToMany('SessionEntity', (session: SessionEntity) => session.user, {
    cascade: true,
  })
  sessions!: SessionEntity[];

  @OneToMany('AccountEntity', (account: AccountEntity) => account.user, {
    cascade: true,
  })
  accounts!: AccountEntity[];
}
