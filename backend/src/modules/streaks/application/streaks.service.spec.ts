import { StreaksService } from './streaks.service';
import { StreaksRepository } from '../domain/repositories/streaks.repository';
import { StreakEntity } from '../domain/entities/streak.entity';

const NOW = new Date('2026-05-24T10:00:00Z');

function localMidnight(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

const TODAY_SOD = localMidnight(NOW);
const yesterday = new Date(NOW);
yesterday.setDate(NOW.getDate() - 1);
const YESTERDAY_SOD = localMidnight(yesterday);
const twoDaysAgo = new Date(NOW);
twoDaysAgo.setDate(NOW.getDate() - 2);
const TWO_DAYS_AGO_SOD = localMidnight(twoDaysAgo);

function makeRepo(): jest.Mocked<StreaksRepository> {
  return {
    findByUserId: jest.fn(),
    upsert: jest.fn(),
  };
}

function makeStreak(o: Partial<StreakEntity> = {}): StreakEntity {
  return {
    id: 'streak-1',
    userId: 'user-1',
    currentStreak: 1,
    longestStreak: 1,
    lastActiveDate: null,
    createdAt: NOW,
    updatedAt: NOW,
    ...o,
  };
}

describe('StreaksService', () => {
  let service: StreaksService;
  let repo: jest.Mocked<StreaksRepository>;

  beforeEach(() => {
    repo = makeRepo();
    service = new StreaksService(repo);
    jest.useFakeTimers().setSystemTime(NOW);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('recordActivity', () => {
    it('creates a streak of 1 for a brand-new user', async () => {
      repo.findByUserId.mockResolvedValue(null);
      const created = makeStreak({
        currentStreak: 1,
        longestStreak: 1,
        lastActiveDate: TODAY_SOD,
      });
      repo.upsert.mockResolvedValue(created);

      const result = await service.recordActivity('user-1');

      expect(repo.upsert).toHaveBeenCalledWith('user-1', {
        currentStreak: 1,
        longestStreak: 1,
        lastActiveDate: TODAY_SOD,
      });
      expect(result.isNewRecord).toBe(true);
      expect(result.streak.currentStreak).toBe(1);
    });

    it('is idempotent when called twice on the same day', async () => {
      repo.findByUserId.mockResolvedValue(
        makeStreak({
          currentStreak: 3,
          longestStreak: 5,
          lastActiveDate: TODAY_SOD,
        }),
      );

      const result = await service.recordActivity('user-1');

      expect(repo.upsert).not.toHaveBeenCalled();
      expect(result.isNewRecord).toBe(false);
      expect(result.streak.currentStreak).toBe(3);
    });

    it('increments streak when last activity was yesterday', async () => {
      repo.findByUserId.mockResolvedValue(
        makeStreak({
          currentStreak: 4,
          longestStreak: 5,
          lastActiveDate: YESTERDAY_SOD,
        }),
      );
      const updated = makeStreak({
        currentStreak: 5,
        longestStreak: 5,
        lastActiveDate: TODAY_SOD,
      });
      repo.upsert.mockResolvedValue(updated);

      const result = await service.recordActivity('user-1');

      expect(repo.upsert).toHaveBeenCalledWith('user-1', {
        currentStreak: 5,
        longestStreak: 5,
        lastActiveDate: TODAY_SOD,
      });
      expect(result.isNewRecord).toBe(false);
    });

    it('resets streak to 1 when last activity was more than 1 day ago', async () => {
      repo.findByUserId.mockResolvedValue(
        makeStreak({
          currentStreak: 10,
          longestStreak: 10,
          lastActiveDate: TWO_DAYS_AGO_SOD,
        }),
      );
      const reset = makeStreak({
        currentStreak: 1,
        longestStreak: 10,
        lastActiveDate: TODAY_SOD,
      });
      repo.upsert.mockResolvedValue(reset);

      const result = await service.recordActivity('user-1');

      expect(repo.upsert).toHaveBeenCalledWith('user-1', {
        currentStreak: 1,
        longestStreak: 10,
        lastActiveDate: TODAY_SOD,
      });
      expect(result.isNewRecord).toBe(false);
    });

    it('detects a new record when streak surpasses longestStreak', async () => {
      repo.findByUserId.mockResolvedValue(
        makeStreak({
          currentStreak: 7,
          longestStreak: 7,
          lastActiveDate: YESTERDAY_SOD,
        }),
      );
      const updated = makeStreak({
        currentStreak: 8,
        longestStreak: 8,
        lastActiveDate: TODAY_SOD,
      });
      repo.upsert.mockResolvedValue(updated);

      const result = await service.recordActivity('user-1');

      expect(repo.upsert).toHaveBeenCalledWith('user-1', {
        currentStreak: 8,
        longestStreak: 8,
        lastActiveDate: TODAY_SOD,
      });
      expect(result.isNewRecord).toBe(true);
    });

    it('does not lower longestStreak when streak resets', async () => {
      repo.findByUserId.mockResolvedValue(
        makeStreak({
          currentStreak: 5,
          longestStreak: 20,
          lastActiveDate: TWO_DAYS_AGO_SOD,
        }),
      );
      const reset = makeStreak({
        currentStreak: 1,
        longestStreak: 20,
        lastActiveDate: TODAY_SOD,
      });
      repo.upsert.mockResolvedValue(reset);

      await service.recordActivity('user-1');

      expect(repo.upsert).toHaveBeenCalledWith(
        'user-1',
        expect.objectContaining({ longestStreak: 20 }),
      );
    });

    it('handles null lastActiveDate as a gap (resets to 1)', async () => {
      repo.findByUserId.mockResolvedValue(
        makeStreak({
          currentStreak: 3,
          longestStreak: 3,
          lastActiveDate: null,
        }),
      );
      const reset = makeStreak({
        currentStreak: 1,
        longestStreak: 3,
        lastActiveDate: TODAY_SOD,
      });
      repo.upsert.mockResolvedValue(reset);

      const result = await service.recordActivity('user-1');

      expect(repo.upsert).toHaveBeenCalledWith('user-1', {
        currentStreak: 1,
        longestStreak: 3,
        lastActiveDate: TODAY_SOD,
      });
      expect(result.isNewRecord).toBe(false);
    });
  });

  describe('getStreak', () => {
    it('returns null when user has no streak', async () => {
      repo.findByUserId.mockResolvedValue(null);
      const result = await service.getStreak('user-1');
      expect(result).toBeNull();
    });

    it('returns existing streak entity', async () => {
      const streak = makeStreak({ currentStreak: 5 });
      repo.findByUserId.mockResolvedValue(streak);
      const result = await service.getStreak('user-1');
      expect(result?.currentStreak).toBe(5);
    });
  });
});
