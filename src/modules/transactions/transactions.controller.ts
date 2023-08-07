import { ApiErrorResponseDto } from '@lib/api/api-error-response.dto';
import { UserId } from '@lib/app/decorators';
import { OffsetPaginationDto } from '@lib/dto';
import { AccountNotFoundError } from '@modules/accounts';
import { CategoryNotFoundError } from '@modules/categories/categories.errors';
import { TransactionEntity } from '@modules/transactions/transactions.entity';
import { plainToClass } from 'class-transformer';
import { TransactionNotFoundError } from './transactions.errors';
import { TransactionEntityTypeEnum } from './transactions.types';
import { TransactionsService } from './transactions.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateTransactionRequestDto,
  CreateTransactionResponseDto,
  DeleteTransactionByIdResponseDto,
  GetTransactionsByAccountResponseDto,
  GetTransactionsRequestDto,
  GetTransactionsResponseDto,
  TransactionItemDto,
  UpdateTransactionByIdRequestDto,
  UpdateTransactionByIdResponseDto,
} from './dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

@Controller('transactions')
@ApiTags('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('create')
  @ApiOperation({ operationId: 'createTransaction' })
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
  ): Promise<CreateTransactionResponseDto> {
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
  @Post('get')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    operationId: 'getTransactions',
  })
  @ApiResponse({ status: HttpStatus.OK, type: GetTransactionsResponseDto })
  async get(
    @UserId() userId: number,
    @Body() getTransactionsDto: GetTransactionsRequestDto = {},
    @Query() paginationDto: OffsetPaginationDto = {},
  ) {
    const { result, count } = await this.transactionsService.get({
      userId,
      getTransactionsDto,
      paginationDto,
    });
    const mappedResult = result.map(this.mapTransactionEntity);

    return plainToClass(GetTransactionsResponseDto, {
      list: mappedResult,
      count,
    });
  }

  @Get(':id')
  @ApiOperation({ operationId: 'getTransactionById' })
  @ApiResponse({ status: HttpStatus.OK, type: TransactionItemDto })
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

      return this.mapTransactionEntity(result);
    } catch (e) {
      if (e instanceof TransactionNotFoundError) {
        throw new NotFoundException(e.message);
      }

      throw e;
    }
  }

  @Patch(':id')
  @ApiOperation({ operationId: 'updateTransactionById' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UpdateTransactionByIdResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: ApiErrorResponseDto,
    description: `${TransactionNotFoundError.message} | ${AccountNotFoundError.message} | ${CategoryNotFoundError.message}`,
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

      return plainToClass(UpdateTransactionByIdResponseDto, { success: true });
    } catch (e) {
      if (
        e instanceof TransactionNotFoundError ||
        e instanceof AccountNotFoundError ||
        e instanceof CategoryNotFoundError
      ) {
        throw new NotFoundException(e.message);
      }

      throw e;
    }
  }

  @Get('account/:id')
  @ApiOperation({ operationId: 'getTransactionsByAccount' })
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
    @Query() paginationDto: OffsetPaginationDto = {},
  ) {
    try {
      const { result, count } = await this.transactionsService.get({
        accountId: id,
        getTransactionsDto: {},
        userId,
        paginationDto,
      });
      const mappedResult = result.map((item) =>
        plainToClass(TransactionItemDto, {
          ...item,
          type: item.type as TransactionEntityTypeEnum,
          categoryId: item.category.id,
          accountId: item.account.id,
          date: item.createdAt,
        }),
      );

      return plainToClass(GetTransactionsByAccountResponseDto, {
        list: mappedResult,
        count,
      });
    } catch (e) {
      if (e instanceof AccountNotFoundError) {
        throw new NotFoundException(e.message);
      }

      throw e;
    }
  }

  @Delete(':id')
  @ApiOperation({ operationId: 'deleteTransactionById' })
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

      return plainToClass(DeleteTransactionByIdResponseDto, { success: true });
    } catch (e) {
      if (e instanceof TransactionNotFoundError) {
        throw new NotFoundException(e.message);
      }

      throw e;
    }
  }

  private mapTransactionEntity(entity: TransactionEntity) {
    return plainToClass(TransactionItemDto, {
      ...entity,
      accountId: entity.account.id,
      categoryId: entity.category.id,
      date: entity.createdAt,
      type: entity.type as TransactionEntityTypeEnum,
    });
  }
}
