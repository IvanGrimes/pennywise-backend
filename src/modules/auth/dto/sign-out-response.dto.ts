import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class SignOutResponseDto {
  @ApiProperty()
  @Expose()
  @IsBoolean()
  success!: boolean;
}
