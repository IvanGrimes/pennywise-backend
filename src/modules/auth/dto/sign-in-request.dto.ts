import { PickType, ApiProperty } from '@nestjs/swagger';
import { SignUpRequestDto } from './sign-up-request.dto';
import { IsBoolean } from 'class-validator';

export class SignInRequestDto extends PickType(SignUpRequestDto, [
  'email',
  'password',
]) {
  @ApiProperty({
    description: 'Whether should create a refresh token',
  })
  @ApiProperty()
  @IsBoolean()
  remember?: boolean;
}
