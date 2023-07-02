import { Inject, Injectable } from '@nestjs/common';
import { Repository, Not, IsNull } from 'typeorm';
import { UserEntity } from './user.entity';
import { userRepositoryDi } from './user.di';
import { CreateUserRequestDto } from './dto';
import {
  UserAlreadyExistsError,
  UserNotFoundError,
} from '@modules/user/user.errors';
import * as argon from 'argon2';

@Injectable()
export class UserService {
  constructor(
    @Inject(userRepositoryDi)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserRequestDto) {
    const exist = await this.userRepository.exist({
      where: { email: createUserDto.email },
    });

    if (exist) {
      throw new UserAlreadyExistsError();
    }

    const passwordHash = await argon.hash(createUserDto.password);
    const user = this.userRepository.create({
      ...createUserDto,
      password: passwordHash,
    });

    await this.userRepository.insert(user);

    return user;
  }

  async find({ id }: { id: number }) {
    const [user] = await this.userRepository.find({
      where: { id },
    });

    if (!user) throw new UserNotFoundError();

    return user;
  }

  async findByEmail({ email }: { email: string }) {
    const [user] = await this.userRepository.find({
      where: { email },
    });

    if (!user) throw new UserNotFoundError();

    return user;
  }

  async updateRefreshToken({
    id,
    refreshToken,
  }: {
    id: number;
    refreshToken: string;
  }) {
    const refreshTokenHash = await argon.hash(refreshToken);

    await this.userRepository.update(id, {
      refreshToken: refreshTokenHash,
    });
  }

  async removeRefreshToken({ id }: { id: number }) {
    await this.userRepository.update(
      { id, refreshToken: Not(IsNull()) },
      { refreshToken: '' },
    );
  }

  verifyHashedValue(hashedValue: string, value: string) {
    return argon.verify(hashedValue, value);
  }
}
