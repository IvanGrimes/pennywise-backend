import {
  IsArray,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { TransactionEntityTypeEnum } from '../transactions.types';
import { ApiProperty } from '@nestjs/swagger';

enum CategoryFilterBehavior {
  exclude = 'exclude',
  include = 'include',
}

export class GetTransactionsRequestDto {
  @ApiProperty({
    required: false,
    enumName: 'TransactionType',
    enum: TransactionEntityTypeEnum,
    default: TransactionEntityTypeEnum.Income,
  })
  @IsEnum(TransactionEntityTypeEnum)
  @IsOptional()
  transactionType?: TransactionEntityTypeEnum;

  // @todo: add date pattern validation
  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  dateFrom?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  dateTo?: string;

  @ApiProperty({ required: false, type: [Number] })
  @IsArray()
  @IsOptional()
  accountIds?: number[];

  @ApiProperty({ required: false, type: [Number] })
  @IsArray()
  @IsOptional()
  categoryIds?: number[];

  @ApiProperty({
    required: false,
    enum: CategoryFilterBehavior,
    enumName: 'CategoryFilterBehavior',
    default: CategoryFilterBehavior.include,
  })
  @IsString()
  @IsOptional()
  categoryBehavior?: CategoryFilterBehavior;
}
