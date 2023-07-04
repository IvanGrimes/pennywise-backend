import { ApiProperty } from '@nestjs/swagger';

export class ResendResponseDto {
  @ApiProperty()
  success!: true;
}
