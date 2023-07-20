import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class GetCategoriesResponseDto {
  @ApiProperty()
  @Expose()
  id!: number;

  @ApiProperty()
  @Expose()
  name!: string;

  @ApiProperty()
  @Expose()
  color!: string;
}
