import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import {
  Controller,
  Get,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { UserService } from './user.service';
import { UserId } from '@lib/app/decorators';
import { MeResponseDto } from './dto';
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
  async me(@UserId() userId: number): Promise<MeResponseDto> {
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
}
