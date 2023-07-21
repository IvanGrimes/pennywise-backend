import { AccountNotFoundError } from './accounts.errors';
import { UserService } from '@modules/user';
import { CreateAccountRequestDto, UpdateAccountByIdRequestDto } from './dto';
import { AccountEntity } from './accounts.entity';
import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { accountsRepositoryDi } from './accounts.di';

@Injectable()
export class AccountsService {
  constructor(
    @Inject(accountsRepositoryDi)
    private readonly accountsRepository: Repository<AccountEntity>,
    private readonly userService: UserService,
  ) {}

  async create(createDto: CreateAccountRequestDto, userId: number) {
    const user = await this.userService.find({ id: userId });
    const account = this.accountsRepository.create(createDto);

    account.user = user;

    if (createDto.isDefault) {
      const defaultAccount = await this.accountsRepository.findOne({
        relations: { user: true },
        where: { user: { id: userId }, isDefault: true },
      });

      if (defaultAccount) {
        defaultAccount.isDefault = false;

        await this.accountsRepository.manager.transaction(
          async (entityManager) => {
            await entityManager.save(defaultAccount);
            await entityManager.save(account);
          },
        );

        return;
      }
    }

    await this.accountsRepository.save(account);
  }

  get(userId: number) {
    return this.accountsRepository.find({
      relations: { user: true },
      where: { user: { id: userId } },
    });
  }

  async getById({ userId, accountId }: { userId: number; accountId: number }) {
    const result = await this.accountsRepository.findOne({
      relations: { user: true, transactions: true },
      where: { user: { id: userId }, id: accountId },
    });

    if (!result) throw new AccountNotFoundError();

    return result;
  }

  async updateById({
    userId,
    accountId,
    updateByIdDto,
  }: {
    userId: number;
    accountId: number;
    updateByIdDto: UpdateAccountByIdRequestDto;
  }) {
    const account = await this.getById({ userId, accountId });

    this.accountsRepository.merge(account, updateByIdDto);

    if (updateByIdDto.isDefault) {
      const previousDefaultAccount = await this.accountsRepository.findOne({
        relations: { user: true },
        where: { user: { id: userId }, isDefault: true },
      });

      if (previousDefaultAccount && previousDefaultAccount.id !== account.id) {
        previousDefaultAccount.isDefault = false;

        return this.accountsRepository.manager.transaction((entityManager) =>
          Promise.all([
            entityManager.save(previousDefaultAccount),
            entityManager.save(account),
          ]),
        );
      }
    }

    return this.accountsRepository.save(account);
  }

  async deleteById({
    userId,
    accountId,
  }: {
    userId: number;
    accountId: number;
  }) {
    const account = await this.getById({ userId, accountId });

    return this.accountsRepository.remove(account);
  }
}
