import { ApiProperty } from '@nestjs/swagger';

export class GetAccountByIdRequestDto {
  @ApiProperty()
  id!: number;
}
