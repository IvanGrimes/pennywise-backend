import { CreateTransactionRequestDto } from './create-transaction-request.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateTransactionByIdRequestDto extends PartialType(
  CreateTransactionRequestDto,
) {}
