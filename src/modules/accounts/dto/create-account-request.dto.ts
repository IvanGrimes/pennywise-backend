import {
  AccountCurrencyEnum,
  AccountIconEnum,
  AccountTypeEnum,
} from '../accounts.types';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsEnum,
  IsBoolean,
} from 'class-validator';

export class CreateAccountRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ enum: AccountTypeEnum })
  @IsEnum(AccountTypeEnum)
  @IsNotEmpty()
  type!: AccountTypeEnum;

  @ApiProperty({ enum: AccountCurrencyEnum })
  @IsEnum(AccountCurrencyEnum)
  @IsNotEmpty()
  currency!: AccountCurrencyEnum;

  @ApiProperty({ enum: AccountIconEnum })
  @IsEnum(AccountIconEnum)
  @IsNotEmpty()
  icon!: AccountIconEnum;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isDefault!: boolean;

  @ApiProperty()
  @ApiProperty()
  @IsNumber()
  balance!: number;
}
