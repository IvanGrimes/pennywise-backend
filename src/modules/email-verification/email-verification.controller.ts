import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  GoneException,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { EmailVerificationService } from './email-verification.service';
import { ResendResponseDto, VerifyRequestDto, VerifyResponseDto } from './dto';
import {
  BadVerificationTokenError,
  EmailAlreadyVerifiedError,
  VerificationTokenExpiredError,
} from './email-verification.errors';
import { UserId, Public, Respond } from '@lib/app/decorators';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiErrorResponseDto } from '@lib/api/api-error-response.dto';

@Controller('email-verification')
@ApiTags('email-verification')
export class EmailVerificationController {
  constructor(
    private readonly emailVerificationService: EmailVerificationService,
  ) {}

  @Post('/verify')
  @HttpCode(HttpStatus.OK)
  @Respond(VerifyResponseDto)
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
    status: HttpStatus.BAD_REQUEST,
    description: BadVerificationTokenError.message,
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: EmailAlreadyVerifiedError.message,
    type: ApiErrorResponseDto,
  })
  async verify(@Body() verifyRequestDto: VerifyRequestDto) {
    try {
      const email = await this.emailVerificationService.decodeConfirmationToken(
        verifyRequestDto.token,
      );

      await this.emailVerificationService.verifyEmail(email);

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

      throw e;
    }
  }

  @Post('/resend')
  @HttpCode(HttpStatus.OK)
  @Respond(ResendResponseDto)
  @ApiOperation({ operationId: 'resend', summary: 'Resend verification link' })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    type: ApiErrorResponseDto,
  })
  async resend(@UserId() userId: number) {
    try {
      await this.emailVerificationService.resendVerificationLink(userId);

      return { success: true };
    } catch (e) {
      if (e instanceof EmailAlreadyVerifiedError) {
        throw new ConflictException(e.message);
      }

      throw e;
    }
  }
}
