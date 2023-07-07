import { EntityBase } from '@src/lib/entity.base';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import type { UserEntity } from '@modules/user';

@Entity({ name: 'sessions' })
export class SessionEntity extends EntityBase {
  @Column()
  accessToken!: string;

  @Column()
  refreshToken!: string;

  @Column({ nullable: true })
  deviceType!: string;

  @Column({ nullable: true })
  deviceBrand!: string;

  @Column({ nullable: true })
  deviceOs!: string;

  @Column()
  ip!: string;

  @Column({ nullable: true })
  location!: string;

  @Column()
  isRevoked!: boolean;

  @ManyToOne('UserEntity', (user: UserEntity) => user.sessions)
  @JoinColumn()
  user!: UserEntity;
}
