import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  GoneException,
  HttpCode,
  HttpStatus,
  Post,
  NotFoundException,
} from '@nestjs/common';
import { EmailVerificationService } from './email-verification.service';
import { ResendResponseDto, VerifyRequestDto, VerifyResponseDto } from './dto';
import {
  BadVerificationTokenError,
  EmailAlreadyVerifiedError,
  VerificationTokenExpiredError,
} from './email-verification.errors';
import { UserId } from '@lib/app/decorators';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiErrorResponseDto } from '@lib/api/api-error-response.dto';
import { UserNotFoundError } from '@modules/user';

@Controller('email-verification')
@ApiTags('email-verification')
export class EmailVerificationController {
  constructor(
    private readonly emailVerificationService: EmailVerificationService,
  ) {}

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ operationId: 'verify', summary: 'Verify email' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: VerifyResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.GONE,
    description: VerificationTokenExpiredError.message,
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: UserNotFoundError.message,
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: BadVerificationTokenError.message,
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: EmailAlreadyVerifiedError.message,
    type: ApiErrorResponseDto,
  })
  async verify(
    @Body() verifyRequestDto: VerifyRequestDto,
  ): Promise<VerifyResponseDto> {
    try {
      await this.emailVerificationService.verifyEmail(verifyRequestDto);

      return { success: true };
    } catch (e) {
      if (e instanceof VerificationTokenExpiredError) {
        throw new GoneException(e.message);
      }
      if (e instanceof BadVerificationTokenError) {
        throw new BadRequestException(e.message);
      }
      if (e instanceof EmailAlreadyVerifiedError) {
        throw new ConflictException(e.message);
      }
      if (e instanceof UserNotFoundError) {
        throw new NotFoundException(e.message);
      }

      throw e;
    }
  }

  @Post('resend')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ operationId: 'resend', summary: 'Resend verification link' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: UserNotFoundError.message,
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: EmailAlreadyVerifiedError.message,
    type: ApiErrorResponseDto,
  })
  async resend(@UserId() userId: number): Promise<ResendResponseDto> {
    try {
      await this.emailVerificationService.resendVerificationLink(userId);

      return { success: true };
    } catch (e) {
      if (e instanceof EmailAlreadyVerifiedError) {
        throw new ConflictException(e.message);
      }
      if (e instanceof UserNotFoundError) {
        throw new NotFoundException(e.message);
      }

      throw e;
    }
  }
}
