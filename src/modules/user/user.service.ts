import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
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
    const exist = await this.existByEmail(createUserDto.email);

    if (exist) {
      throw new UserAlreadyExistsError();
    }

    const user = this.userRepository.create({
      ...createUserDto,
      password: await this.hash(createUserDto.password),
      sessions: [],
    });

    await this.userRepository.save(user);

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

  async markEmailAsVerified(email: string) {
    const exist = await this.existByEmail(email);

    if (!exist) throw new UserNotFoundError();

    return this.userRepository.update({ email }, { isEmailVerified: true });
  }

  async setResetPasswordToken({
    email,
    token,
  }: {
    email: string;
    token: string;
  }) {
    const exist = await this.existByEmail(email);

    if (!exist) throw new UserNotFoundError();

    return this.userRepository.update({ email }, { resetPasswordToken: token });
  }

  existByEmail(email: string) {
    return this.userRepository.exist({ where: { email } });
  }

  async setPassword({ email, password }: { email: string; password: string }) {
    const hashedPassword = await this.hash(password);

    return this.userRepository.update(
      { email },
      { password: hashedPassword, resetPasswordToken: undefined },
    );
  }

  verifyHashedValue(hashedValue: string, value: string) {
    return argon.verify(hashedValue, value);
  }

  private hash(value: string) {
    return argon.hash(value);
  }
}
