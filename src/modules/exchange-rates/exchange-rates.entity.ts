import { EntityBase } from '@lib/entity.base';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'exchange_rates' })
export class ExchangeRatesEntity extends EntityBase {
  @Column({ type: 'float' })
  RUB!: number;

  @Column({ type: 'float' })
  USD!: number;

  @Column({ type: 'float' })
  GBP!: number;

  @Column({ type: 'float' })
  AED!: number;
}
