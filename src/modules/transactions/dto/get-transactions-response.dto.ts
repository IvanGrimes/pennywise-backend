import { TransactionEntityTypeEnum } from '../transactions.types';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class GetTransactionsResponseDto {
  @ApiProperty()
  @Expose()
  id!: number;

  @ApiProperty({ enum: TransactionEntityTypeEnum })
  @Expose()
  type!: TransactionEntityTypeEnum;

  @ApiProperty()
  @Expose()
  amount!: number;

  @ApiProperty({ nullable: true })
  @Expose()
  description?: string;

  @ApiProperty()
  @Expose()
  accountId!: number;

  @ApiProperty()
  @Expose()
  categoryId!: number;

  @ApiProperty()
  @Expose()
  date!: Date;
}
