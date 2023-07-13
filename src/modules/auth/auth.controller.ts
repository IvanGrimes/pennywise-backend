import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';
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
} from './dto';
import {
  RefreshTokenNotFoundError,
  WrongCredentialsError,
  WrongRefreshTokenError,
} from './auth.error';
import { UserAlreadyExistsError, UserNotFoundError } from '@modules/user';
import { refreshTokenCookie } from '@src/const/refreshTokenCookie';
import { RefreshTokenGuard } from '@lib/app/guards';
import {
  FromUser,
  UserId,
  Public,
  Respond,
  AccessToken,
} from '@lib/app/decorators';
import { EmailVerificationService } from '@modules/email-verification';
import { SessionInterceptor, SessionNotFoundError } from '@modules/session';

@Controller('auth')
@ApiTags('auth')
@UseInterceptors(SessionInterceptor)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailVerificationService: EmailVerificationService,
  ) {}

  @Post('sign-up')
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

      if (result.refreshToken) {
        this.setRefreshTokenCookie({
          response,
          refreshToken: result.refreshToken,
        });
      }

      return result;
    } catch (e) {
      if (e instanceof UserAlreadyExistsError) {
        throw new ConflictException(e.message);
      }

      throw e;
    }
  }

  @Post('sign-in')
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
    @Req() request: Request,
  ) {
    try {
      const result = await this.authService.signIn(signInDto);

      if (result.refreshToken) {
        this.setRefreshTokenCookie({
          response,
          refreshToken: result.refreshToken,
        });
      }

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

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
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
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @UserId() userId: number,
    @FromUser('refreshToken') refreshToken: string,
    @AccessToken() accessToken: string,
  ) {
    try {
      const result = await this.authService.refresh({
        userId,
        accessToken,
        refreshToken,
      });

      return result;
    } catch (e) {
      if (e instanceof UserNotFoundError) {
        throw new UnauthorizedException(UserNotFoundError.message);
      }
      if (e instanceof WrongRefreshTokenError) {
        throw new UnauthorizedException(WrongRefreshTokenError.message);
      }
      if (e instanceof SessionNotFoundError) {
        throw new UnauthorizedException(SessionNotFoundError.message);
      }
      if (e instanceof RefreshTokenNotFoundError) {
        throw new UnauthorizedException(RefreshTokenNotFoundError.message);
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
  @Public()
  async signOut(@AccessToken() accessToken: string) {
    await this.authService.signOut({ accessToken });

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
