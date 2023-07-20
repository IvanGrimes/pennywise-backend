import { CategoryNotFoundError } from './categories.errors';
import { UserService } from '@modules/user';
import {
  CreateCategoryRequestDto,
  DeleteCategoryRequestDto,
  UpdateCategoryRequestDto,
} from './dto';
import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CategoryEntity } from './categories.entity';
import { categoriesRepositoryDi } from './categories.di';

@Injectable()
export class CategoriesService {
  constructor(
    @Inject(categoriesRepositoryDi)
    private readonly categoriesRepository: Repository<CategoryEntity>,
    private readonly userService: UserService,
  ) {}

  async create(createCategoryDto: CreateCategoryRequestDto, userId: number) {
    const user = await this.userService.find({ id: userId });
    const category = this.categoriesRepository.create(createCategoryDto);

    category.user = user;

    await this.categoriesRepository.save(category);
  }

  get(userId: number) {
    return this.categoriesRepository.find({
      relations: { user: true },
      where: { user: { id: userId } },
    });
  }

  async update({
    userId,
    categoryId,
    updateCategoryDto,
  }: {
    userId: number;
    categoryId: number;
    updateCategoryDto: UpdateCategoryRequestDto;
  }) {
    const category = await this.categoriesRepository.exist({
      relations: { user: true },
      where: { id: categoryId, user: { id: userId } },
    });

    if (!category) throw new CategoryNotFoundError();

    return this.categoriesRepository.update(categoryId, updateCategoryDto);
  }

  async getById({
    userId,
    categoryId,
  }: {
    userId: number;
    categoryId: number;
  }) {
    const result = await this.categoriesRepository.findOne({
      relations: { user: true },
      where: { id: categoryId, user: { id: userId } },
    });

    if (!result) throw new CategoryNotFoundError();

    return result;
  }

  async deleteById({
    userId,
    categoryId,
    deleteCategoryDto,
  }: {
    userId: number;
    categoryId: number;
    deleteCategoryDto: DeleteCategoryRequestDto;
  }) {
    const category = await this.categoriesRepository.findOne({
      relations: { user: true, transactions: true },
      where: { id: categoryId, user: { id: userId } },
    });
    const newCategory = await this.categoriesRepository.findOne({
      relations: { user: true, transactions: true },
      where: { id: deleteCategoryDto.newCategoryId, user: { id: userId } },
    });

    if (!category || !newCategory) throw new CategoryNotFoundError();

    category.transactions?.forEach((transaction) => {
      transaction.category = newCategory;
    });

    return this.categoriesRepository.manager.transaction(
      async (entityManager) => {
        await entityManager.save(category.transactions);

        await entityManager.remove(category);
      },
    );
  }
}
