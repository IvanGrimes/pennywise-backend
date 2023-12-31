import { SignUpResponseDto } from './sign-up-response.dto';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class SignInResponseDto extends PickType(SignUpResponseDto, [
  'accessToken',
]) {
  @ApiProperty({ required: false })
  @Expose()
  refreshToken?: string;
}
