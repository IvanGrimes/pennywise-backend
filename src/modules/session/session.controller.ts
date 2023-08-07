import { Controller, Get, HttpStatus, Post, Body } from '@nestjs/common';
import { UserId, AccessToken } from '@lib/app/decorators';
import { SessionService } from './session.service';
import {
  AllResponseDto,
  TerminateRequestDto,
  TerminateResponseDto,
  TerminateAllResponseDto,
} from './dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('session')
@ApiTags('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get('all')
  @ApiOperation({ operationId: 'all' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [AllResponseDto],
  })
  async getSessions(
    @UserId() userId: number,
    @AccessToken() accessToken: string,
  ): Promise<AllResponseDto[]> {
    const result = await this.sessionService.findAll(userId);

    return result
      .filter((item) => !item.isRevoked)
      .map<AllResponseDto>((item) => ({
        ...item,
        isCurrent: item.accessToken === accessToken,
      }))
      .sort((a, b) => (a.updatedAt > b.updatedAt ? -1 : 1))
      .sort((a, b) => (a.isCurrent > b.isCurrent ? -1 : 1));
  }

  @Post('terminate')
  @ApiOperation({ operationId: 'terminate' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: TerminateResponseDto,
  })
  async terminateSession(
    @Body() terminateDto: TerminateRequestDto,
  ): Promise<TerminateResponseDto> {
    await this.sessionService.revoke(terminateDto);

    return { success: true };
  }

  @Post('terminate-all')
  @ApiOperation({ operationId: 'terminateAll' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: TerminateResponseDto,
  })
  async terminateAllSessions(
    @UserId() userId: number,
    @AccessToken() accessToken: string,
  ): Promise<TerminateAllResponseDto> {
    await this.sessionService.revokeAllOther({ userId, accessToken });

    return { success: true };
  }
}
