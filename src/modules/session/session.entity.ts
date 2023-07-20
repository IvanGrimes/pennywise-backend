import { EntityBase } from '@src/lib/entity.base';
import { Column, Entity, ManyToOne } from 'typeorm';
import type { UserEntity } from '@modules/user';
import { Exclude } from 'class-transformer';

@Entity({ name: 'sessions' })
export class SessionEntity extends EntityBase {
  @Column()
  @Exclude()
  accessToken!: string;

  @Column({ nullable: true })
  @Exclude()
  refreshToken!: string;

  @Column({ nullable: true })
  browserName!: string;

  @Column({ nullable: true })
  browserVersion!: string;

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

  @Exclude()
  @ManyToOne('UserEntity', (user: UserEntity) => user.sessions)
  user!: UserEntity;
}
