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
import { VerifyRequestDto, VerifyResponseDto } from './dto';
import {
  BadVerificationTokenError,
  EmailAlreadyVerifiedError,
  VerificationTokenExpiredError,
} from './email-verification.errors';
import { Respond } from '@lib/app/decorators';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiErrorResponseDto } from '@lib/api/api-error-response.dto';

@Controller('email-verification')
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
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    type: ApiErrorResponseDto,
  })
  async verify(@Body() verifyRequestDto: VerifyRequestDto) {
    try {
      const email = await this.emailVerificationService.decodeConfirmationToken(
        verifyRequestDto.token,
      );

      await this.emailVerificationService.confirmEmail(email);

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
}
