import { EntityBase } from '@src/lib/entity.base';
import { Column, Entity, OneToMany, JoinColumn } from 'typeorm';
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

  @Column({ nullable: true })
  @Exclude()
  refreshToken!: string;

  @Column({ default: false })
  isEmailVerified!: boolean;

  @OneToMany('SessionEntity', (session: SessionEntity) => session.user, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  sessions!: SessionEntity[];
}
