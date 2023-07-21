import { AccountsService } from '@modules/accounts';
import { CategoriesService } from '@modules/categories';
import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import {
  CreateTransactionRequestDto,
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

  get(userId: number) {
    return this.transactionRepository.find({
      relations: { account: true, category: true },
      where: { account: { user: { id: userId } } },
    });
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

    if (!result) throw new TransactionNotFoundError();

    return result;
  }

  async getTransactionsByAccount({
    userId,
    accountId,
  }: {
    userId: number;
    accountId: number;
  }) {
    return this.transactionRepository.find({
      relations: { account: true, category: true },
      where: { account: { id: accountId, user: { id: userId } } },
    });
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
      transaction.amount = updateByIdDto.amount;
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

    return this.transactionRepository.remove(transaction);
  }
}
