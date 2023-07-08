import { Inject, Injectable } from '@nestjs/common';
import { Repository, Not } from 'typeorm';
import { SessionEntity } from './session.entity';
import { sessionRepositoryDi } from './session.di';
import { SessionNotFoundError } from './session.error';
import { ClsService } from 'nestjs-cls';
import { SessionInformation } from './session.interceptor';
import { TerminateRequestDto } from './dto';

@Injectable()
export class SessionService {
  constructor(
    @Inject(sessionRepositoryDi)
    private readonly sessionRepository: Repository<SessionEntity>,
    private readonly clsService: ClsService,
  ) {}

  async create({
    accessToken,
    refreshToken,
  }: {
    accessToken: string;
    refreshToken?: string;
  }) {
    const sessionInformation: SessionInformation =
      this.clsService.get('sessionInformation');

    const session = this.sessionRepository.create({
      accessToken,
      refreshToken,
      browserName: sessionInformation.device.client?.name,
      browserVersion: sessionInformation.device.client?.version,
      deviceType: sessionInformation.device.device?.type,
      deviceBrand: sessionInformation.device.device?.brand,
      deviceOs: sessionInformation.device.os?.name,
      ip: sessionInformation.ip,
      location: sessionInformation.location,
      isRevoked: false,
    });

    await this.sessionRepository.save(session);

    return session;
  }

  async find({ accessToken, userId }: { userId: number; accessToken: string }) {
    const session = await this.sessionRepository.findOne({
      relations: { user: true },
      where: { user: { id: userId }, accessToken },
    });

    if (!session) {
      throw new SessionNotFoundError();
    }

    return session;
  }

  findAll(userId: number) {
    return this.sessionRepository.find({
      relations: { user: true },
      where: { user: { id: userId } },
    });
  }

  revoke({ id }: TerminateRequestDto) {
    return this.sessionRepository.update({ id }, { isRevoked: true });
  }

  revokeByAccessToken(accessToken: string) {
    return this.sessionRepository.update({ accessToken }, { isRevoked: true });
  }

  revokeAllOther({
    userId,
    accessToken,
  }: {
    userId: number;
    accessToken: string;
  }) {
    return this.sessionRepository.update(
      {
        user: { id: userId },
        accessToken: Not(accessToken),
      },
      { isRevoked: true },
    );
  }

  update({ id, accessToken }: { id: number; accessToken: string }) {
    return this.sessionRepository.update(id, { accessToken: accessToken });
  }
}
