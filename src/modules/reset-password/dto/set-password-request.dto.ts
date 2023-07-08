import { IsStrongPassword } from '@lib/app/decorators';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class SetPasswordRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  token!: string;

  @ApiProperty({ description: 'New password' })
  @IsStrongPassword()
  password!: string;
}
