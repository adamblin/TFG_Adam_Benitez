import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/infrastructure/prisma/prisma.module';
import { StreaksModule } from '../streaks/streaks.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { XPModule } from '../xp/xp.module';
import { FocusSessionsRepository } from './domain/repositories/focus-sessions.repository';
import { PrismaFocusSessionsRepository } from './infrastructure/repositories/prisma-focus-sessions.repository';
import { StartSessionUseCase } from './application/use-cases/start-session.use-case';
import { EndSessionUseCase } from './application/use-cases/end-session.use-case';
import { ListSessionsUseCase } from './application/use-cases/list-sessions.use-case';
import { FocusSessionsService } from './application/focus-sessions.service';
import { FocusSessionsController } from './api/focus-sessions.controller';

@Module({
  imports: [PrismaModule, StreaksModule, NotificationsModule, XPModule],
  controllers: [FocusSessionsController],
  providers: [
    { provide: FocusSessionsRepository, useClass: PrismaFocusSessionsRepository },
    StartSessionUseCase,
    EndSessionUseCase,
    ListSessionsUseCase,
    FocusSessionsService,
  ],
  exports: [FocusSessionsService],
})
export class FocusSessionsModule {}
