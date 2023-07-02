import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignOutResponseDto {
  @ApiProperty()
  @IsBoolean()
  success: boolean;

  constructor({ success }: SignOutResponseDto) {
    this.success = success;
  }
}
