import { Respond, UserId } from '@lib/app/decorators';
import { ExchangeRatesAreUnavailable } from '@modules/exchange-rates';
import { AnalyticsService } from './analytics.service';
import {
  Controller,
  Get,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { GetExpensesByCategoriesResponseDto } from './dto';

@Controller('analytics')
@ApiTags('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('getExpensesByCategories')
  @Respond(GetExpensesByCategoriesResponseDto)
  @ApiOperation({ operationId: 'getExpensesByCategories' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [GetExpensesByCategoriesResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: ExchangeRatesAreUnavailable,
  })
  async getExpensesByCategories(@UserId() userId: number) {
    try {
      const result = await this.analyticsService.getExpensesByCategories(
        userId,
      );

      return result.sort((a, b) => b.percentage - a.percentage);
    } catch (e) {
      if (e instanceof ExchangeRatesAreUnavailable) {
        throw new InternalServerErrorException(e.message);
      }

      throw e;
    }
  }
}
