import { CurrencyEnum } from '@lib/types';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { AccountIconEnum, AccountTypeEnum } from '../accounts.types';

export class GetAccountByIdResponseDto {
  @ApiProperty()
  @Expose()
  id!: number;

  @ApiProperty({ enum: AccountTypeEnum })
  @Expose()
  type!: AccountTypeEnum;

  @ApiProperty()
  @Expose()
  name!: string;

  @ApiProperty({ enum: AccountIconEnum })
  @Expose()
  icon!: AccountIconEnum;

  @ApiProperty()
  @Expose()
  balance!: number;

  @ApiProperty()
  @Expose()
  isDefault!: boolean;

  @ApiProperty({ enum: CurrencyEnum })
  @Expose()
  currency!: CurrencyEnum;
}
