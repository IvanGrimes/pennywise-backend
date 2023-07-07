import { Module } from '@nestjs/common';
import { sessionProviders } from './session.providers';
import { SessionService } from './session.service';
import { DatabaseModule } from '@modules/database';
import { SessionController } from './session.controller';

@Module({
  imports: [DatabaseModule],
  providers: [...sessionProviders, SessionService],
  controllers: [SessionController],
  exports: [SessionService],
})
export class SessionModule {}
