import { PickType } from '@nestjs/swagger';
import { CreateUserRequestDto } from './create-user-request.dto';

export class FindUserByEmailRequestDto extends PickType(CreateUserRequestDto, [
  'email',
]) {}
