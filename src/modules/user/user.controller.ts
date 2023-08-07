import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Patch,
  UnauthorizedException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { UserService } from './user.service';
import { UserId } from '@lib/app/decorators';
import { MeResponseDto, UpdateMeRequestDto } from './dto';
import { UserNotFoundError } from './user.errors';
import { ApiErrorResponseDto } from '@lib/api/api-error-response.dto';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiOperation({ operationId: 'me' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: MeResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: ApiErrorResponseDto,
  })
  async me(@UserId() userId: number) {
    try {
      const result = await this.userService.find({ id: userId });

      return plainToClass(MeResponseDto, result);
    } catch (e) {
      if (e instanceof UserNotFoundError) {
        throw new UnauthorizedException(e.message);
      }

      throw e;
    }
  }

  @Patch('me')
  @ApiOperation({ operationId: 'updateMe' })
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: ApiErrorResponseDto,
  })
  async updateMe(
    @UserId() userId: number,
    @Body() updateMeDto: UpdateMeRequestDto,
  ) {
    try {
      await this.userService.updateById({ id: userId, entity: updateMeDto });
    } catch (e) {
      if (e instanceof UserNotFoundError) {
        throw new UnauthorizedException(e.message);
      }

      throw e;
    }
  }
}
