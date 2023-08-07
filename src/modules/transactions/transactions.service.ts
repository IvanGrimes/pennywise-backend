import { OffsetPaginationDto } from '@lib/dto';
import { getTransactionFilters } from '@lib/filters/transactions';
import { AccountsService } from '@modules/accounts';
import { CategoriesService } from '@modules/categories';
import { ExchangeRatesService } from '@modules/exchange-rates';
import { UserEntity, UserService } from '@modules/user';
import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import {
  CreateTransactionRequestDto,
  GetTransactionsRequestDto,
  UpdateTransactionByIdRequestDto,
} from './dto';
import { transactionsRepositoryDi } from './transactions.di';
import { TransactionEntity } from './transactions.entity';
import { TransactionNotFoundError } from './transactions.errors';
import { TransactionEntityTypeEnum } from './transactions.types';

@Injectable()
export class TransactionsService {
  constructor(
    @Inject(transactionsRepositoryDi)
    private readonly transactionRepository: Repository<TransactionEntity>,
    private readonly accountsService: AccountsService,
    private readonly categoriesService: CategoriesService,
    private readonly exchangeRates: ExchangeRatesService,
    private readonly userService: UserService,
  ) {}

  async create(createDto: CreateTransactionRequestDto, userId: number) {
    const account = await this.accountsService.getById({
      accountId: createDto.accountId,
      userId,
    });
    const category = await this.categoriesService.getById({
      categoryId: createDto.categoryId,
      userId,
    });
    const transaction = this.transactionRepository.create({
      ...createDto,
      account,
      category,
    });

    return this.transactionRepository.manager.transaction(
      async (transactionalEntityManager) => {
        if (createDto.type === TransactionEntityTypeEnum.Income) {
          account.balance += transaction.amount;
        } else {
          account.balance -= transaction.amount;
        }

        await transactionalEntityManager.save(account);

        transaction.account = account;

        await transactionalEntityManager.save(transaction);
      },
    );
  }

  async get({
    userId,
    accountId,
    getTransactionsDto,
    paginationDto,
  }: {
    userId: number;
    accountId?: number;
    getTransactionsDto: GetTransactionsRequestDto;
    paginationDto: OffsetPaginationDto;
  }) {
    const filters = getTransactionFilters(getTransactionsDto);
    const { offset = 0, limit = 10 } = paginationDto;
    const [result, count] = await this.transactionRepository.findAndCount({
      relations: { account: true, category: true },
      where: {
        type: filters.transaction.transactionType,
        createdAt: filters.transaction.createdAt,
        account: {
          id: filters.account.id ?? accountId,
          user: { id: userId },
        },
        category: {
          id: filters.category.id,
        },
      },
      order: { createdAt: 'desc' },
      skip: offset,
      take: limit,
    });
    const user = await this.userService.find({ id: userId });

    const mappedResult = await Promise.all(
      result.map((item) => this.mapTransaction({ entity: item, user })),
    );

    return { result: mappedResult, count };
  }

  async getById({
    transactionId,
    userId,
  }: {
    transactionId: number;
    userId: number;
  }) {
    const result = await this.transactionRepository.findOne({
      relations: { account: true, category: true },
      where: { account: { user: { id: userId } }, id: transactionId },
    });
    const user = await this.userService.find({ id: userId });

    if (!result) throw new TransactionNotFoundError();

    return this.mapTransaction({ entity: result, user });
  }

  async updateById({
    transactionId,
    userId,
    updateByIdDto,
  }: {
    transactionId: number;
    userId: number;
    updateByIdDto: UpdateTransactionByIdRequestDto;
  }) {
    const transaction = await this.getById({ transactionId, userId });
    const currentAccount = transaction.account;
    const nextAccount = updateByIdDto.accountId
      ? await this.accountsService.getById({
          userId,
          accountId: updateByIdDto.accountId ?? transaction.account.id,
        })
      : null;

    transaction.description = updateByIdDto.description;

    if (typeof updateByIdDto.categoryId !== 'undefined') {
      transaction.category = await this.categoriesService.getById({
        userId,
        categoryId: updateByIdDto.categoryId,
      });
    }

    if (typeof updateByIdDto.amount !== 'undefined') {
      transaction.account.balance +=
        transaction.amount * (transaction.type === 'outcome' ? 1 : -1);

      transaction.amount = updateByIdDto.amount;

      transaction.account.balance +=
        transaction.amount * (transaction.type === 'outcome' ? -1 : 1);
    }

    if (updateByIdDto.type && updateByIdDto.type !== transaction.type) {
      if (
        transaction.type === TransactionEntityTypeEnum.Income &&
        updateByIdDto.type === TransactionEntityTypeEnum.Outcome
      ) {
        transaction.account.balance -= transaction.amount * 2;
      }
      if (
        transaction.type === TransactionEntityTypeEnum.Outcome &&
        updateByIdDto.type === TransactionEntityTypeEnum.Income
      ) {
        transaction.account.balance += transaction.amount * 2;
      }

      transaction.type = updateByIdDto.type;
    }

    if (nextAccount && transaction.account.id !== updateByIdDto.accountId) {
      transaction.account.balance +=
        transaction.type === TransactionEntityTypeEnum.Income
          ? -transaction.amount
          : transaction.amount;

      nextAccount.balance +=
        transaction.type === TransactionEntityTypeEnum.Income
          ? transaction.amount
          : -transaction.amount;

      transaction.account = nextAccount;
    }

    return this.transactionRepository.manager.transaction(
      async (transactionalEntityManager) => {
        await transactionalEntityManager.save(transaction);
        await transactionalEntityManager.save(currentAccount);
      },
    );
  }

  async deleteById({
    userId,
    transactionId,
  }: {
    userId: number;
    transactionId: number;
  }) {
    const transaction = await this.getById({ userId, transactionId });

    switch (transaction.type) {
      case TransactionEntityTypeEnum.Income:
        transaction.account.balance -= transaction.amount;
        break;
      case TransactionEntityTypeEnum.Outcome:
        transaction.account.balance += transaction.amount;
        break;
      case TransactionEntityTypeEnum.Transfer:
      // @todo: to add
    }

    return this.transactionRepository.manager.transaction(
      async (entityManager) => {
        await Promise.all([
          entityManager.save(transaction.account),
          entityManager.remove(transaction),
        ]);
      },
    );
  }

  private async mapTransaction({
    entity,
    user,
  }: {
    entity: TransactionEntity;
    user: UserEntity;
  }) {
    if (entity.account.currency === user.mainCurrency) return entity;

    return {
      ...entity,
      mainCurrencyAmount: await this.exchangeRates.convert({
        value: entity.amount,
        from: entity.account.currency,
        to: user.mainCurrency,
      }),
    };
  }
}
