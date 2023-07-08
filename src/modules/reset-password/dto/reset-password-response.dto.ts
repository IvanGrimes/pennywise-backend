import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
import { Expose } from 'class-transformer';

export class ResetPasswordResponseDto {
  @ApiProperty()
  @IsBoolean()
  @Expose()
  success!: boolean;
}
