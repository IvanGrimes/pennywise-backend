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
  @Exclude()
  public id!: number;

  @Column()
  @Generated('uuid')
  public uuid!: string;

  @CreateDateColumn()
  @Exclude()
  public createdAt!: Date;

  @UpdateDateColumn()
  @Exclude()
  public updatedAt!: Date;
}
