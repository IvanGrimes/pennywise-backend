import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CreateCategoryResponseDto {
  @ApiProperty()
  @Expose()
  success!: true;
}
