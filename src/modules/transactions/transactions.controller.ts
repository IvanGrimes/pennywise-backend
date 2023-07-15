import { ApiErrorResponseDto } from '@lib/api/api-error-response.dto';
import { Respond, UserId } from '@lib/app/decorators';
import { AccountNotFoundError } from '@modules/accounts';
import { TransactionNotFoundError } from './transactions.errors';
import { TransactionEntityTypeEnum } from './transactions.types';
import { TransactionsService } from './transactions.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateTransactionRequestDto,
  CreateTransactionResponseDto,
  DeleteTransactionByIdResponseDto,
  GetTransactionByIdResponseDto,
  GetTransactionsByAccountResponseDto,
  GetTransactionsResponseDto,
  UpdateTransactionByIdRequestDto,
  UpdateTransactionByIdResponseDto,
} from './dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

@Controller('transactions')
@ApiTags('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('create')
  @Respond(CreateTransactionResponseDto)
  @ApiOperation({ operationId: 'create' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CreateTransactionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: AccountNotFoundError.message,
    type: ApiErrorResponseDto,
  })
  async create(
    @Body() createRequestDto: CreateTransactionRequestDto,
    @UserId() userId: number,
  ) {
    try {
      await this.transactionsService.create(createRequestDto, userId);

      return { success: true };
    } catch (e) {
      if (e instanceof AccountNotFoundError) {
        throw new NotFoundException(e.message);
      }

      throw e;
    }
  }

  // @todo: add pagination
  @Get('get')
  @Respond(GetTransactionsResponseDto)
  @ApiOperation({ operationId: 'get' })
  @ApiResponse({ status: HttpStatus.OK, type: [GetTransactionsResponseDto] })
  async get(@UserId() userId: number) {
    const result = await this.transactionsService.get(userId);

    return result.map<GetTransactionsResponseDto>((item) => ({
      ...item,
      accountId: item.account.id,
      date: item.createdAt,
      type: item.type as TransactionEntityTypeEnum,
    }));
  }

  @Get(':id')
  @Respond(GetTransactionByIdResponseDto)
  @ApiOperation({ operationId: 'getById' })
  @ApiResponse({ status: HttpStatus.OK, type: GetTransactionByIdResponseDto })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: ApiErrorResponseDto,
    description: TransactionNotFoundError.message,
  })
  async getById(@Param('id') id: number, @UserId() userId: number) {
    try {
      const result = await this.transactionsService.getById({
        transactionId: id,
        userId,
      });

      return {
        ...result,
        accountId: result.account.id,
        date: result.createdAt,
        type: result.type as TransactionEntityTypeEnum,
      };
    } catch (e) {
      if (e instanceof TransactionNotFoundError) {
        throw new NotFoundException(e.message);
      }

      throw e;
    }
  }

  @Patch(':id')
  @Respond(UpdateTransactionByIdResponseDto)
  @ApiOperation({ operationId: 'updateById' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UpdateTransactionByIdResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: ApiErrorResponseDto,
    description: `${TransactionNotFoundError.message} | ${AccountNotFoundError.message}`,
  })
  async updateById(
    @Param('id') id: number,
    @UserId() userId: number,
    @Body() updateByIdDto: UpdateTransactionByIdRequestDto,
  ) {
    try {
      await this.transactionsService.updateById({
        transactionId: id,
        userId,
        updateByIdDto,
      });

      return { success: true };
    } catch (e) {
      if (
        e instanceof TransactionNotFoundError ||
        e instanceof AccountNotFoundError
      ) {
        throw new NotFoundException(e.message);
      }

      throw e;
    }
  }

  @Get('account/:id')
  @Respond(GetTransactionsByAccountResponseDto)
  @ApiOperation({ operationId: 'updateById' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetTransactionsByAccountResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: ApiErrorResponseDto,
    description: AccountNotFoundError.message,
  })
  async getTransactionsByAccount(
    @Param('id') id: number,
    @UserId() userId: number,
  ) {
    try {
      const result = await this.transactionsService.getTransactionsByAccount({
        accountId: id,
        userId,
      });

      return result.map<GetTransactionsByAccountResponseDto>((item) => ({
        ...item,
        type: item.type as TransactionEntityTypeEnum,
        accountId: item.account.id,
        date: item.createdAt,
      }));
    } catch (e) {
      if (e instanceof AccountNotFoundError) {
        throw new NotFoundException(e.message);
      }

      throw e;
    }
  }

  @Delete(':id')
  @Respond(DeleteTransactionByIdResponseDto)
  @ApiOperation({ operationId: 'deleteById' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: DeleteTransactionByIdResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: ApiErrorResponseDto,
    description: TransactionNotFoundError.message,
  })
  async deleteById(@Param('id') id: number, @UserId() userId: number) {
    try {
      await this.transactionsService.deleteById({ transactionId: id, userId });

      return { success: true };
    } catch (e) {
      if (e instanceof TransactionNotFoundError) {
        throw new NotFoundException(e.message);
      }

      throw e;
    }
  }

  // @todo: add pagination
}
