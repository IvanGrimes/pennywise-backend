import { Module } from '@nestjs/common';
import { sessionProviders } from './session.providers';
import { SessionService } from './session.service';
import { DatabaseModule } from '@modules/database';

@Module({
  imports: [DatabaseModule],
  providers: [...sessionProviders, SessionService],
  controllers: [],
  exports: [SessionService],
})
export class SessionModule {}
