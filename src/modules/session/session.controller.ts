import { Controller, Get, HttpStatus, Post, Body } from '@nestjs/common';
import { UserId, Respond, AccessToken } from '@lib/app/decorators';
import { SessionService } from './session.service';
import { SessionNotFoundError } from './session.error';
import { NotFoundException } from '@lib/exceptions';
import {
  AllResponseDto,
  TerminateRequestDto,
  TerminateResponseDto,
  TerminateAllResponseDto,
} from './dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiErrorResponseDto } from '@lib/api/api-error-response.dto';

@Controller('session')
@ApiTags('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get('all')
  @Respond(AllResponseDto)
  @ApiOperation({ operationId: 'all' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: AllResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: ApiErrorResponseDto,
  })
  async getSessions(
    @UserId() userId: number,
    @AccessToken() accessToken: string,
  ) {
    try {
      const result = await this.sessionService.findAll(userId);

      return result
        .filter((item) => !item.isRevoked)
        .map<AllResponseDto>((item) => ({
          ...item,
          isCurrent: item.accessToken === accessToken,
        }));
    } catch (e) {
      if (e instanceof SessionNotFoundError) {
        throw new NotFoundException(SessionNotFoundError.message);
      }

      throw e;
    }
  }

  @Post('terminate')
  @ApiOperation({ operationId: 'terminate' })
  @Respond(TerminateResponseDto)
  async terminateSession(@Body() terminateDto: TerminateRequestDto) {
    await this.sessionService.revoke(terminateDto);

    return { success: true };
  }

  @Post('terminate-all')
  @ApiOperation({ operationId: 'terminateAll' })
  @Respond(TerminateAllResponseDto)
  async terminateAllSessions(
    @UserId() userId: number,
    @AccessToken() accessToken: string,
  ) {
    await this.sessionService.revokeAllOther({ userId, accessToken });

    return { success: true };
  }
}
