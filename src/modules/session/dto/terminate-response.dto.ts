import { ApiProperty } from '@nestjs/swagger';

export class TerminateResponseDto {
  @ApiProperty()
  success!: boolean;
}
