import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { TransactionEntityTypeEnum } from '../transactions.types';

export class CreateTransactionRequestDto {
  @ApiProperty({
    enum: TransactionEntityTypeEnum,
    enumName: 'TransactionType',
    example: [
      TransactionEntityTypeEnum.Income,
      TransactionEntityTypeEnum.Outcome,
    ],
  })
  @IsEnum(TransactionEntityTypeEnum)
  type!: TransactionEntityTypeEnum;

  @ApiProperty()
  @IsNumber()
  accountId!: number;

  @ApiProperty()
  @IsNumber()
  amount!: number;

  @ApiProperty()
  @IsString()
  description?: string;
}
