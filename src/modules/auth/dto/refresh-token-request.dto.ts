import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RefreshTokenRequestDto {
  @IsNumber()
  userId: number;

  @IsString()
  @IsNotEmpty()
  refreshToken: string;

  constructor({ userId, refreshToken }: RefreshTokenRequestDto) {
    this.userId = userId;
    this.refreshToken = refreshToken;
  }
}
