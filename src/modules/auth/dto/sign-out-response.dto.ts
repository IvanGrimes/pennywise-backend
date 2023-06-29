import { IsBoolean } from 'class-validator';

export class SignOutResponseDto {
  @IsBoolean()
  success: boolean;

  constructor({ success }: SignOutResponseDto) {
    this.success = success;
  }
}
