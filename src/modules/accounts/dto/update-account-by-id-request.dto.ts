import { PickType } from '@nestjs/swagger';
import { CreateAccountRequestDto } from './create-account-request.dto';

export class UpdateAccountByIdRequestDto extends PickType(
  CreateAccountRequestDto,
  ['name'],
) {}
