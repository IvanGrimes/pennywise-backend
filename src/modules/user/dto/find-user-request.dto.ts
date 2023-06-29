import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class FindUserRequestDto {
  @ApiProperty()
  @IsNumber()
  id: number;

  constructor({ id }: FindUserRequestDto) {
    this.id = id;
  }
}
