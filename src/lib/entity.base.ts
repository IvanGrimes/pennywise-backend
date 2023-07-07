import {
  PrimaryGeneratedColumn,
  Column,
  Generated,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

export class EntityBase {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @Generated('uuid')
  @Exclude()
  uuid!: string;

  @CreateDateColumn()
  @Exclude()
  createdAt!: Date;

  @UpdateDateColumn()
  @Exclude()
  updatedAt!: Date;
}
