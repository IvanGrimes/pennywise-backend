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
    const entity = this.accountsRepository.create(createDto);

    await this.accountsRepository.save(entity);

    await this.userService.saveAccount({ id: userId, account: entity });
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

    account.name = updateByIdDto.name;

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
