import { ApiProperty } from '@nestjs/swagger';

export class VerifyResponseDto {
  @ApiProperty()
  success!: true;
}
