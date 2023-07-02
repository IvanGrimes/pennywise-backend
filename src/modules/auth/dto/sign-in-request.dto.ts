import { PickType } from '@nestjs/swagger';
import { SignUpRequestDto } from './sign-up-request.dto';

export class SignInRequestDto extends PickType(SignUpRequestDto, [
  'email',
  'password',
]) {}
