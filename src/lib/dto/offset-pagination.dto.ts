import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class OffsetPaginationDto {
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  offset?: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  limit?: number;
}
