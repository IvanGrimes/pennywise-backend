import { ApiErrorResponseDto } from '@lib/api/api-error-response.dto';
import { Respond, UserId } from '@lib/app/decorators';
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
  @Respond(CreateAccountResponseDto)
  @ApiOperation({ operationId: 'create' })
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

      return { success: true };
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  @Get('get')
  @Respond(GetAccountsResponseDto)
  @ApiOperation({ operationId: 'get' })
  @ApiResponse({ status: HttpStatus.OK, type: [GetAccountsResponseDto] })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: ApiErrorResponseDto,
  })
  async get(@UserId() userId: number) {
    try {
      return this.accountsService.get(userId);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  @Get(':id')
  @Respond(GetAccountsResponseDto)
  @ApiOperation({ operationId: 'getById' })
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
      return this.accountsService.getById({ userId, accountId });
    } catch (e) {
      if (e instanceof AccountNotFoundError) {
        throw new NotFoundException(e.message);
      }

      throw new InternalServerErrorException(e);
    }
  }

  @Patch(':id')
  @Respond(UpdateAccountByIdResponseDto)
  @ApiOperation({ operationId: 'updateById' })
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

      return { success: true };
    } catch (e) {
      if (e instanceof AccountNotFoundError) {
        throw new NotFoundException(e.message);
      }

      throw e;
    }
  }

  @Delete(':id')
  @Respond(DeleteAccountByIdResponseDto)
  @ApiOperation({ operationId: 'deleteById' })
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: AccountNotFoundError.message,
    type: ApiErrorResponseDto,
  })
  async deleteById(@Param('id') id: number, @UserId() userId: number) {
    try {
      await this.accountsService.deleteById({ userId, accountId: id });

      return { success: true };
    } catch (e) {
      throw e;
    }
  }
}
