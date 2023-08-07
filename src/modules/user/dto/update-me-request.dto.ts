import { CurrencyEnum } from '@lib/types';
import {
  firstNameMaxLength,
  firstNameMinLength,
  lastNameMaxLength,
  lastNameMinLength,
} from '@src/const/user';
import { IsEnum, IsOptional, MaxLength, MinLength } from 'class-validator';
import { StartDayEnum } from '../user.types';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMeRequestDto {
  @ApiProperty({
    minLength: firstNameMinLength,
    maxLength: firstNameMaxLength,
  })
  @MinLength(firstNameMinLength)
  @MaxLength(firstNameMaxLength)
  @IsOptional()
  firstName!: string;

  @ApiProperty({
    minLength: lastNameMinLength,
    maxLength: lastNameMaxLength,
  })
  @MinLength(lastNameMinLength)
  @MaxLength(lastNameMaxLength)
  @IsOptional()
  lastName!: string;

  @ApiProperty({ type: 'enum', enum: CurrencyEnum })
  @IsEnum(CurrencyEnum)
  @IsOptional()
  mainCurrency?: CurrencyEnum;

  @ApiProperty({ type: 'enum', enum: StartDayEnum })
  @IsEnum(StartDayEnum)
  @IsOptional()
  startDay?: StartDayEnum;
}
