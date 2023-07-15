import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class GetAccountsResponseDto {
  @ApiProperty()
  @Expose()
  id!: number;

  @ApiProperty()
  @Expose()
  name!: string;

  @ApiProperty()
  @Expose()
  balance!: number;
}
