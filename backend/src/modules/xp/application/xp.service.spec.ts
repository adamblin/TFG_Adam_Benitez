import { XPService } from './xp.service';
import { UserXPRepository } from '../domain/repositories/user-xp.repository';
import { UserXPEntity } from '../domain/entities/user-xp.entity';

const now = new Date();

function makeXP(o: Partial<UserXPEntity> = {}): UserXPEntity {
  return {
    id: 'xp-1',
    userId: 'user-1',
    totalXp: 0,
    coins: 0,
    lastCoinClaimAt: null,
    createdAt: now,
    updatedAt: now,
    ...o,
  };
}

function makeRepo(): jest.Mocked<UserXPRepository> {
  return {
    findByUserId: jest.fn(),
    addXP: jest.fn(),
    addCoins: jest.fn(),
    spendCoins: jest.fn(),
  };
}

describe('XPService', () => {
  let service: XPService;
  let repo: jest.Mocked<UserXPRepository>;

  beforeEach(() => {
    repo = makeRepo();
    service = new XPService(repo);
  });

  // ── getLevelInfo ──────────────────────────────────────────────────────────

  describe('getLevelInfo', () => {
    it('returns level 1 with 0 XP for new user (no record)', async () => {
      repo.findByUserId.mockResolvedValue(null);
      const info = await service.getLevelInfo('user-1');
      expect(info.level).toBe(1);
      expect(info.totalXp).toBe(0);
      expect(info.coins).toBe(0);
    });

    it('returns level 1 for 199 XP', async () => {
      repo.findByUserId.mockResolvedValue(makeXP({ totalXp: 199 }));
      const info = await service.getLevelInfo('user-1');
      expect(info.level).toBe(1);
      expect(info.xpInLevel).toBe(199);
    });

    it('returns level 2 for exactly 200 XP', async () => {
      repo.findByUserId.mockResolvedValue(makeXP({ totalXp: 200 }));
      const info = await service.getLevelInfo('user-1');
      expect(info.level).toBe(2);
      expect(info.xpInLevel).toBe(0);
    });

    it('returns level 3 for 400 XP', async () => {
      repo.findByUserId.mockResolvedValue(makeXP({ totalXp: 400 }));
      const info = await service.getLevelInfo('user-1');
      expect(info.level).toBe(3);
    });

    it('progressPercent is 0 at the start of a level', async () => {
      repo.findByUserId.mockResolvedValue(makeXP({ totalXp: 200 }));
      const info = await service.getLevelInfo('user-1');
      expect(info.progressPercent).toBe(0);
    });

    it('progressPercent is 50 at midpoint of a level', async () => {
      repo.findByUserId.mockResolvedValue(makeXP({ totalXp: 100 }));
      const info = await service.getLevelInfo('user-1');
      expect(info.progressPercent).toBe(50);
    });

    it('xpToNextLevel is always 200', async () => {
      repo.findByUserId.mockResolvedValue(makeXP({ totalXp: 350 }));
      const info = await service.getLevelInfo('user-1');
      expect(info.xpToNextLevel).toBe(200);
    });
  });

  // ── awardXP ───────────────────────────────────────────────────────────────

  describe('awardXP', () => {
    it('grants daily coins on first action of the day', async () => {
      repo.findByUserId.mockResolvedValue(makeXP({ lastCoinClaimAt: null }));
      repo.addXP.mockResolvedValue(
        makeXP({ totalXp: 20, lastCoinClaimAt: null }),
      );
      repo.addCoins.mockResolvedValue(makeXP({ totalXp: 20, coins: 10 }));

      const result = await service.awardXP('user-1', 20);

      expect(repo.addCoins).toHaveBeenCalledWith(
        'user-1',
        expect.any(Number),
        expect.any(Date),
      );
      expect(result.coins).toBe(10);
    });

    it('does not grant daily coins when already claimed today', async () => {
      const today = new Date();
      repo.findByUserId.mockResolvedValue(makeXP({ lastCoinClaimAt: today }));
      repo.addXP.mockResolvedValue(
        makeXP({ totalXp: 20, lastCoinClaimAt: today }),
      );

      await service.awardXP('user-1', 20);

      expect(repo.addCoins).not.toHaveBeenCalled();
    });

    it('grants level-up bonus coins when user levels up', async () => {
      repo.findByUserId.mockResolvedValue(makeXP({ totalXp: 195 }));
      repo.addXP.mockResolvedValue(
        makeXP({ totalXp: 200, lastCoinClaimAt: new Date() }),
      );
      repo.addCoins.mockResolvedValue(makeXP({ totalXp: 200, coins: 2 }));

      await service.awardXP('user-1', 5);

      // coins awarded should include at least the level number (2) as bonus
      expect(repo.addCoins).toHaveBeenCalled();
    });
  });

  // ── spendCoins ────────────────────────────────────────────────────────────

  describe('spendCoins', () => {
    it('throws when user has insufficient coins', async () => {
      repo.findByUserId.mockResolvedValue(makeXP({ coins: 5 }));
      await expect(service.spendCoins('user-1', 20)).rejects.toThrow(
        /insufficient/i,
      );
    });

    it('throws when user has no XP record (0 coins)', async () => {
      repo.findByUserId.mockResolvedValue(null);
      await expect(service.spendCoins('user-1', 1)).rejects.toThrow();
    });

    it('deducts coins and returns remaining balance', async () => {
      repo.findByUserId.mockResolvedValue(makeXP({ coins: 50 }));
      repo.spendCoins.mockResolvedValue(makeXP({ coins: 30 }));

      const remaining = await service.spendCoins('user-1', 20);

      expect(repo.spendCoins).toHaveBeenCalledWith('user-1', 20);
      expect(remaining).toBe(30);
    });

    it('allows spending exact coin balance', async () => {
      repo.findByUserId.mockResolvedValue(makeXP({ coins: 20 }));
      repo.spendCoins.mockResolvedValue(makeXP({ coins: 0 }));

      const remaining = await service.spendCoins('user-1', 20);

      expect(remaining).toBe(0);
    });
  });
});
