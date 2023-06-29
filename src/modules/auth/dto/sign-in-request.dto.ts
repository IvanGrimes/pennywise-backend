import { ApiProperty } from '@nestjs/swagger';
import { FindUserByEmailRequestDto } from '@modules/user';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignInRequestDto extends FindUserByEmailRequestDto {
  @ApiProperty({ description: 'The password of a user' })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
