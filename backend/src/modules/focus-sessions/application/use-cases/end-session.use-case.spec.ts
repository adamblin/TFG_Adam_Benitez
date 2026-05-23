import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { EndSessionUseCase } from './end-session.use-case';
import { FocusSessionsRepository } from '../../domain/repositories/focus-sessions.repository';
import { StreaksService } from 'src/modules/streaks/application/streaks.service';
import { NotificationsService } from 'src/modules/notifications/notifications.service';
import { XPService } from 'src/modules/xp/application/xp.service';
import { FocusSessionEntity } from '../../domain/entities/focus-session.entity';
import { StreakEntity } from 'src/modules/streaks/domain/entities/streak.entity';

const now = new Date();

function makeSession(o: Partial<FocusSessionEntity> = {}): FocusSessionEntity {
  return {
    id: 'sess-1',
    userId: 'user-1',
    taskId: null,
    durationMin: 25,
    startedAt: now,
    endedAt: null,
    completed: false,
    createdAt: now,
    updatedAt: now,
    ...o,
  };
}

function makeStreak(): StreakEntity {
  return {
    id: 'streak-1',
    userId: 'user-1',
    currentStreak: 1,
    longestStreak: 1,
    lastActiveDate: now,
    createdAt: now,
    updatedAt: now,
  };
}

function makeRepo(): jest.Mocked<FocusSessionsRepository> {
  return {
    findByUserId: jest.fn(),
    findById: jest.fn(),
    findActive: jest.fn(),
    countCompletedToday: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
}

describe('EndSessionUseCase', () => {
  let useCase: EndSessionUseCase;
  let repo: jest.Mocked<FocusSessionsRepository>;
  let streaksService: jest.Mocked<StreaksService>;
  let notificationsService: jest.Mocked<NotificationsService>;
  let xpService: jest.Mocked<XPService>;

  beforeEach(() => {
    repo = makeRepo();
    streaksService = {
      getStreak: jest.fn(),
      recordActivity: jest.fn(),
    } as unknown as jest.Mocked<StreaksService>;
    notificationsService = {
      getSessionCompleteMessage: jest.fn().mockReturnValue('Great job!'),
    };
    xpService = {
      getLevelInfo: jest.fn(),
      awardXP: jest.fn(),
      spendCoins: jest.fn(),
    } as unknown as jest.Mocked<XPService>;
    useCase = new EndSessionUseCase(
      repo,
      streaksService,
      notificationsService,
      xpService,
    );
  });

  it('throws NotFoundException when session does not exist', async () => {
    repo.findById.mockResolvedValue(null);
    await expect(
      useCase.execute({
        userId: 'user-1',
        sessionId: 'ghost',
        completed: false,
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws ForbiddenException when session belongs to another user', async () => {
    repo.findById.mockResolvedValue(makeSession({ userId: 'other-user' }));
    await expect(
      useCase.execute({
        userId: 'user-1',
        sessionId: 'sess-1',
        completed: false,
      }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('ends session without awarding XP when completed=false', async () => {
    repo.findById.mockResolvedValue(makeSession());
    repo.update.mockResolvedValue(
      makeSession({ endedAt: now, completed: false }),
    );

    const result = await useCase.execute({
      userId: 'user-1',
      sessionId: 'sess-1',
      completed: false,
    });

    expect(xpService.awardXP).not.toHaveBeenCalled();
    expect(streaksService.recordActivity).not.toHaveBeenCalled();
    expect(result.session.endedAt).toBeDefined();
    expect(typeof result.message).toBe('string');
  });

  it('awards XP (durationMin * 2) when completed=true', async () => {
    repo.findById.mockResolvedValue(makeSession({ durationMin: 25 }));
    repo.update.mockResolvedValue(
      makeSession({ endedAt: now, completed: true }),
    );
    streaksService.recordActivity.mockResolvedValue({
      streak: makeStreak(),
      isNewRecord: false,
    });
    repo.countCompletedToday.mockResolvedValue(1);
    xpService.awardXP.mockResolvedValue({
      totalXp: 50,
      level: 1,
      xpInLevel: 50,
      xpToNextLevel: 200,
      progressPercent: 25,
      coins: 0,
    });

    await useCase.execute({
      userId: 'user-1',
      sessionId: 'sess-1',
      completed: true,
    });

    expect(xpService.awardXP).toHaveBeenCalledWith('user-1', 50);
  });

  it('records streak activity when completed=true', async () => {
    repo.findById.mockResolvedValue(makeSession());
    repo.update.mockResolvedValue(
      makeSession({ endedAt: now, completed: true }),
    );
    streaksService.recordActivity.mockResolvedValue({
      streak: makeStreak(),
      isNewRecord: false,
    });
    repo.countCompletedToday.mockResolvedValue(1);
    xpService.awardXP.mockResolvedValue({
      totalXp: 50,
      level: 1,
      xpInLevel: 50,
      xpToNextLevel: 200,
      progressPercent: 25,
      coins: 0,
    });

    await useCase.execute({
      userId: 'user-1',
      sessionId: 'sess-1',
      completed: true,
    });

    expect(streaksService.recordActivity).toHaveBeenCalledWith('user-1');
  });

  it('returns a message from NotificationsService', async () => {
    repo.findById.mockResolvedValue(makeSession());
    repo.update.mockResolvedValue(
      makeSession({ endedAt: now, completed: true }),
    );
    streaksService.recordActivity.mockResolvedValue({
      streak: makeStreak(),
      isNewRecord: false,
    });
    repo.countCompletedToday.mockResolvedValue(1);
    xpService.awardXP.mockResolvedValue({
      totalXp: 50,
      level: 1,
      xpInLevel: 50,
      xpToNextLevel: 200,
      progressPercent: 25,
      coins: 0,
    });
    notificationsService.getSessionCompleteMessage.mockReturnValue(
      'Streak: 1 day!',
    );

    const result = await useCase.execute({
      userId: 'user-1',
      sessionId: 'sess-1',
      completed: true,
    });

    expect(result.message).toBe('Streak: 1 day!');
  });
});
