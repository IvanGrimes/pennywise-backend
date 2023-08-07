import { ApiErrorResponseDto } from '@lib/api/api-error-response.dto';
import { UserId } from '@lib/app/decorators';
import { plainToClass } from 'class-transformer';
import { AccountNotFoundError } from './accounts.errors';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateAccountRequestDto,
  CreateAccountResponseDto,
  DeleteAccountByIdResponseDto,
  GetAccountsResponseDto,
  UpdateAccountByIdRequestDto,
  UpdateAccountByIdResponseDto,
} from './dto';
import { AccountsService } from './accounts.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

@Controller('accounts')
@ApiTags('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post('create')
  @ApiOperation({ operationId: 'createAccount' })
  @ApiResponse({ status: HttpStatus.CREATED, type: CreateAccountResponseDto })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: ApiErrorResponseDto,
  })
  async create(
    @UserId() userId: number,
    @Body() createRequestDto: CreateAccountRequestDto,
  ) {
    try {
      await this.accountsService.create(createRequestDto, userId);

      return plainToClass(CreateAccountResponseDto, { success: true });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  // @todo: sort accounts respecting isDefault prop
  @Get('get')
  @ApiOperation({ operationId: 'getAccounts' })
  @ApiResponse({ status: HttpStatus.OK, type: [GetAccountsResponseDto] })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: ApiErrorResponseDto,
  })
  async get(@UserId() userId: number) {
    try {
      const result = await this.accountsService.get(userId);

      return result.map((item) => plainToClass(GetAccountsResponseDto, item));
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  @Get(':id')
  @ApiOperation({ operationId: 'getAccountById' })
  @ApiResponse({ status: HttpStatus.OK, type: GetAccountsResponseDto })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: AccountNotFoundError.message,
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: ApiErrorResponseDto,
  })
  async getById(@Param('id') accountId: number, @UserId() userId: number) {
    try {
      const result = this.accountsService.getById({ userId, accountId });

      return plainToClass(GetAccountsResponseDto, result);
    } catch (e) {
      if (e instanceof AccountNotFoundError) {
        throw new NotFoundException(e.message);
      }

      throw new InternalServerErrorException(e);
    }
  }

  @Patch(':id')
  @ApiOperation({ operationId: 'updateAccountById' })
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: AccountNotFoundError.message,
    type: ApiErrorResponseDto,
  })
  async updateById(
    @Param('id') id: number,
    @UserId() userId: number,
    @Body() updateByIdDto: UpdateAccountByIdRequestDto,
  ) {
    try {
      await this.accountsService.updateById({
        accountId: id,
        userId,
        updateByIdDto,
      });

      return plainToClass(UpdateAccountByIdResponseDto, { success: true });
    } catch (e) {
      if (e instanceof AccountNotFoundError) {
        throw new NotFoundException(e.message);
      }

      throw e;
    }
  }

  @Delete(':id')
  @ApiOperation({ operationId: 'deleteAccountById' })
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: AccountNotFoundError.message,
    type: ApiErrorResponseDto,
  })
  async deleteById(@Param('id') id: number, @UserId() userId: number) {
    try {
      await this.accountsService.deleteById({ userId, accountId: id });

      return plainToClass(DeleteAccountByIdResponseDto, { success: true });
    } catch (e) {
      throw e;
    }
  }
}
