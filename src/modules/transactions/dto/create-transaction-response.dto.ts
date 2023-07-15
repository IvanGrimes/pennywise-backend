import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsBoolean } from 'class-validator';

export class CreateTransactionResponseDto {
  @ApiProperty()
  @Expose()
  @IsBoolean()
  success!: boolean;
}
