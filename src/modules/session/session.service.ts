import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SessionEntity } from './session.entity';
import { sessionRepositoryDi } from './session.di';
import { SessionNotFoundError } from './session.error';
import { ClsService } from 'nestjs-cls';
import { SessionInformation } from '@modules/session/session.interceptor';

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
    refreshToken: string;
  }) {
    const sessionInformation: SessionInformation =
      this.clsService.get('sessionInformation');

    const session = this.sessionRepository.create({
      accessToken,
      refreshToken,
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

  async find({ accessToken }: { userId: number; accessToken: string }) {
    const session = await this.sessionRepository.findOne({
      relations: { user: true },
      where: { accessToken },
    });

    if (!session) {
      throw new SessionNotFoundError();
    }

    return session;
  }

  revoke({ accessToken }: { accessToken: string }) {
    return this.sessionRepository.delete({ accessToken: accessToken });
  }

  update({ id, accessToken }: { id: number; accessToken: string }) {
    return this.sessionRepository.update(id, { accessToken: accessToken });
  }
}
