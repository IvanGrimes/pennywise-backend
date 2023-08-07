import {
  Controller,
  Get,
  Query,
  NotFoundException,
  HttpStatus,
  Post,
  HttpCode,
  GoneException,
  BadRequestException,
  Body,
  ConflictException,
} from '@nestjs/common';
import {
  ResetPasswordRequestDto,
  ResetPasswordResponseDto,
  SetPasswordRequestDto,
  SetPasswordResponseDto,
} from './dto';
import { ResetPasswordService } from './reset-password.service';
import { UserNotFoundError } from '@modules/user';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from '@lib/app/decorators';
import { ApiErrorResponseDto } from '@lib/api/api-error-response.dto';
import {
  BadResetPasswordTokenError,
  NewPasswordMustBeDifferent,
  ResetPasswordTokenExpiredError,
  ResetPasswordTokenNotFoundError,
} from './reset-password.errors';
import { ApiTags } from '@nestjs/swagger';

@Controller('reset-password')
@ApiTags('reset-password')
export class ResetPasswordController {
  constructor(private readonly resetPasswordService: ResetPasswordService) {}

  @Get('reset')
  @Public()
  @ApiOperation({ operationId: 'reset', summary: 'Reset password' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResetPasswordResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: UserNotFoundError.message,
    type: ApiErrorResponseDto,
  })
  async resetPassword(
    @Query() resetPasswordDto: ResetPasswordRequestDto,
  ): Promise<ResetPasswordResponseDto> {
    try {
      await this.resetPasswordService.sendResetLink(resetPasswordDto);

      return { success: true };
    } catch (e) {
      if (e instanceof UserNotFoundError) {
        throw new NotFoundException(e.message);
      }

      throw e;
    }
  }

  @Post('set-password')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ operationId: 'setPassword', summary: 'Set new password' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SetPasswordResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: BadResetPasswordTokenError.message,
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ResetPasswordTokenNotFoundError.message,
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: NewPasswordMustBeDifferent.message,
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.GONE,
    description: ResetPasswordTokenExpiredError.message,
    type: ApiErrorResponseDto,
  })
  async setPassword(
    @Body() setPasswordDto: SetPasswordRequestDto,
  ): Promise<SetPasswordResponseDto> {
    try {
      await this.resetPasswordService.setPassword(setPasswordDto);

      return { success: true };
    } catch (e) {
      if (
        e instanceof ResetPasswordTokenNotFoundError ||
        e instanceof UserNotFoundError
      ) {
        throw new NotFoundException(ResetPasswordTokenNotFoundError.message);
      }
      if (e instanceof ResetPasswordTokenExpiredError) {
        throw new GoneException(e.message);
      }
      if (e instanceof BadResetPasswordTokenError) {
        throw new BadRequestException(e.message);
      }
      if (e instanceof NewPasswordMustBeDifferent) {
        throw new ConflictException(e.message);
      }

      throw e;
    }
  }
}
