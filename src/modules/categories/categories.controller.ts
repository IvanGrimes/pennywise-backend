import { ApiErrorResponseDto } from '@lib/api/api-error-response.dto';
import { UserId } from '@lib/app/decorators';
import { plainToClass } from 'class-transformer';
import { CategoryNotFoundError } from './categories.errors';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateCategoryRequestDto,
  CreateCategoryResponseDto,
  DeleteCategoryRequestDto,
  DeleteCategoryResponseDto,
  GetCategoriesResponseDto,
  UpdateCategoryRequestDto,
  UpdateCategoryResponseDto,
} from './dto';
import { CategoriesService } from './categories.service';

@Controller('categories')
@ApiTags('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post('create')
  @ApiOperation({ operationId: 'createCategory' })
  @ApiResponse({ status: HttpStatus.CREATED, type: CreateCategoryResponseDto })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR })
  async create(
    @Body() createCategoryDto: CreateCategoryRequestDto,
    @UserId() userId: number,
  ): Promise<CreateCategoryResponseDto> {
    await this.categoriesService.create(createCategoryDto, userId);

    return { success: true };
  }

  @Get('get')
  @ApiOperation({ operationId: 'getCategories' })
  @ApiResponse({ status: HttpStatus.OK, type: [GetCategoriesResponseDto] })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR })
  async get(@UserId() userId: number): Promise<GetCategoriesResponseDto[]> {
    const result = await this.categoriesService.get(userId);

    return result.map((item) => plainToClass(GetCategoriesResponseDto, item));
  }

  @Get(':id')
  @ApiOperation({ operationId: 'getCategoryById' })
  @ApiResponse({ status: HttpStatus.OK, type: GetCategoriesResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: ApiErrorResponseDto })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR })
  async getById(
    @Param('id') id: number,
    @UserId() userId: number,
  ): Promise<GetCategoriesResponseDto> {
    try {
      return this.categoriesService.getById({ userId, categoryId: id });
    } catch (e) {
      if (e instanceof CategoryNotFoundError) {
        throw new NotFoundException(e.message);
      }

      throw e;
    }
  }

  @Patch('update/:id')
  @ApiOperation({ operationId: 'updateCategory' })
  @ApiResponse({ status: HttpStatus.OK, type: [UpdateCategoryResponseDto] })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: ApiErrorResponseDto,
    description: CategoryNotFoundError.message,
  })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR })
  async update(
    @Body() updateCategoryDto: UpdateCategoryRequestDto,
    @Param('id') id: number,
    @UserId() userId: number,
  ): Promise<UpdateCategoryResponseDto> {
    try {
      await this.categoriesService.update({
        updateCategoryDto,
        categoryId: id,
        userId,
      });

      return { success: true };
    } catch (e) {
      if (e instanceof CategoryNotFoundError) {
        throw new NotFoundException(e.message);
      }

      throw e;
    }
  }

  @Delete('delete/:id')
  @ApiOperation({ operationId: 'deleteById' })
  @ApiResponse({ status: HttpStatus.OK, type: DeleteCategoryResponseDto })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: ApiErrorResponseDto,
    description: CategoryNotFoundError.message,
  })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR })
  async deleteById(
    @Param('id') id: number,
    @UserId() userId: number,
    @Body() deleteCategoryDto: DeleteCategoryRequestDto,
  ): Promise<DeleteCategoryResponseDto> {
    try {
      await this.categoriesService.deleteById({
        categoryId: id,
        userId,
        deleteCategoryDto,
      });

      return { success: true };
    } catch (e) {
      if (e instanceof CategoryNotFoundError) {
        throw new NotFoundException(e.message);
      }

      throw e;
    }
  }
}
