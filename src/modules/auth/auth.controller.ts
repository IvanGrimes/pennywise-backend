import {
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiErrorResponseDto } from '@lib/api/api-error-response.dto';
import {
  SignUpRequestDto,
  SignUpResponseDto,
  SignInRequestDto,
  SignInResponseDto,
  RefreshTokenResponseDto,
  SignOutResponseDto,
  UserResponseDto,
} from './dto';
import {
  RefreshTokenNotFoundOrExpired,
  UserAlreadyExistsError,
  UserNotFoundError,
  WrongCredentialsError,
  WrongRefreshToken,
} from './auth.error';
import { refreshTokenCookie } from '@src/const/refreshTokenCookie';
import { RefreshTokenGuard } from '@lib/app/guards';
import { GetUser, GetUserId, Public, Respond } from '@lib/app/decorators';
import { JwtPayload } from '@modules/auth/auth.types';
import { EmailVerificationService } from 'src/modules/email-verification';

@Controller('/auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailVerificationService: EmailVerificationService,
  ) {}

  @Post('/sign-up')
  @Respond(SignUpResponseDto)
  @Public()
  @ApiOperation({ operationId: 'signUp', summary: 'Sign up' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: SignUpResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: UserAlreadyExistsError.message,
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
  })
  async signUp(
    @Body() signUpDto: SignUpRequestDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const result = await this.authService.signUp(signUpDto);

      await this.emailVerificationService.sendVerificationLink(signUpDto.email);

      this.setRefreshTokenCookie({
        response,
        refreshToken: result.refreshToken,
      });

      return result;
    } catch (e) {
      if (e instanceof UserAlreadyExistsError) {
        throw new ConflictException(e.message);
      }

      throw e;
    }
  }

  @Post('/sign-in')
  @HttpCode(HttpStatus.OK)
  @Respond(SignInResponseDto)
  @Public()
  @ApiOperation({ operationId: 'signIn', summary: 'Sign in' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SignInResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: WrongCredentialsError.message,
    type: ApiErrorResponseDto,
  })
  async signIn(
    @Body() signInDto: SignInRequestDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const result = await this.authService.signIn(signInDto);

      this.setRefreshTokenCookie({
        response,
        refreshToken: result.refreshToken,
      });

      return result;
    } catch (e) {
      if (
        e instanceof UserNotFoundError ||
        e instanceof WrongCredentialsError
      ) {
        throw new UnauthorizedException(WrongCredentialsError.message);
      }

      throw e;
    }
  }

  @Get('/user')
  @Respond(UserResponseDto)
  @ApiOperation({ operationId: 'user' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserResponseDto,
  })
  async user(@GetUser() user: JwtPayload) {
    return user;
  }

  @UseGuards(RefreshTokenGuard)
  @Post('/refresh')
  @Respond(RefreshTokenResponseDto)
  @ApiOperation({ operationId: 'refresh', summary: 'Refresh access token' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: RefreshTokenResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: ApiErrorResponseDto,
  })
  @Public()
  async refresh(
    @Res({ passthrough: true }) response: Response,
    @GetUserId() userId: number,
    @GetUser('refreshToken') refreshToken: string,
  ) {
    try {
      const result = await this.authService.refresh({ userId, refreshToken });

      this.setRefreshTokenCookie({
        response,
        refreshToken: result.refreshToken,
      });

      return result;
    } catch (e) {
      if (
        e instanceof UserNotFoundError ||
        e instanceof RefreshTokenNotFoundOrExpired ||
        e instanceof WrongRefreshToken
      ) {
        throw new UnauthorizedException(RefreshTokenNotFoundOrExpired.message);
      }

      throw e;
    }
  }

  @Post('/sign-out')
  @ApiOperation({ operationId: 'signOut', summary: 'Sign out' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: SignOutResponseDto,
  })
  async signOut(@GetUserId() userId: number) {
    await this.authService.signOut({ id: userId });

    return { success: true };
  }

  private setRefreshTokenCookie({
    response,
    refreshToken,
  }: {
    response: Response;
    refreshToken: string;
  }) {
    const expires = new Date();

    expires.setDate(expires.getDate() + 7);

    response.cookie(refreshTokenCookie, refreshToken, {
      httpOnly: true,
      expires,
      domain: 'localhost',
      signed: true,
      sameSite: 'lax',
    });
  }
}
