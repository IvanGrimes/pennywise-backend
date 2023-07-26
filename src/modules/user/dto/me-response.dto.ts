import { CurrencyEnum } from '@lib/types';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class MeResponseDto {
  @ApiProperty()
  @Expose()
  firstName!: string;

  @ApiProperty()
  @Expose()
  lastName!: string;

  @ApiProperty()
  @Expose()
  email!: string;

  @ApiProperty()
  @Expose()
  isEmailVerified!: boolean;

  @ApiProperty({ type: 'enum', enum: CurrencyEnum })
  @Expose()
  mainCurrency!: CurrencyEnum;
}
