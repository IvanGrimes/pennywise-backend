import { PartialType, PickType } from '@nestjs/swagger';
import { CreateAccountRequestDto } from './create-account-request.dto';

export class UpdateAccountByIdRequestDto extends PartialType(
  PickType(CreateAccountRequestDto, ['type', 'name', 'isDefault', 'icon']),
) {}
