import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class DeleteCategoryRequestDto {
  @ApiProperty()
  @IsNumber()
  newCategoryId!: number;
}
