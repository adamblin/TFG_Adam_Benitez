import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { FocusSessionsRepository } from '../../domain/repositories/focus-sessions.repository';
import { StreaksService } from 'src/modules/streaks/application/streaks.service';
import { NotificationsService } from 'src/modules/notifications/notifications.service';
import { XPService } from 'src/modules/xp/application/xp.service';
import { FocusSessionEntity } from '../../domain/entities/focus-session.entity';
import { EndSessionInput } from '../inputs/end-session.input';

export type EndSessionResult = {
  session: FocusSessionEntity;
  message: string;
};

@Injectable()
export class EndSessionUseCase {
  constructor(
    private readonly repo: FocusSessionsRepository,
    private readonly streaksService: StreaksService,
    private readonly notificationsService: NotificationsService,
    private readonly xpService: XPService,
  ) {}

  async execute(input: EndSessionInput): Promise<EndSessionResult> {
    const session = await this.repo.findById(input.sessionId);
    if (!session) throw new NotFoundException('Session not found');
    if (session.userId !== input.userId) throw new ForbiddenException('Access denied');

    const updated = await this.repo.update(input.sessionId, {
      endedAt: new Date(),
      completed: input.completed,
    });

    let message = 'Session ended.';

    if (input.completed) {
      const xpGained = updated.durationMin * 2;
      await this.xpService.awardXP(input.userId, xpGained);
      const { streak, isNewRecord } = await this.streaksService.recordActivity(input.userId);
      const sessionsToday = await this.repo.countCompletedToday(input.userId);
      message = this.notificationsService.getSessionCompleteMessage({
        currentStreak: streak.currentStreak,
        isNewRecord,
        sessionsToday,
      });
    }

    return { session: updated, message };
  }
}
