import { StartSessionUseCase } from './start-session.use-case';
import { FocusSessionsRepository } from '../../domain/repositories/focus-sessions.repository';
import { FocusSessionEntity } from '../../domain/entities/focus-session.entity';

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

describe('StartSessionUseCase', () => {
  let useCase: StartSessionUseCase;
  let repo: jest.Mocked<FocusSessionsRepository>;

  beforeEach(() => {
    repo = makeRepo();
    useCase = new StartSessionUseCase(repo);
  });

  it('creates a new session when no active session exists', async () => {
    repo.findActive.mockResolvedValue(null);
    repo.create.mockResolvedValue(makeSession({ durationMin: 25 }));

    const result = await useCase.execute({ userId: 'user-1', durationMin: 25 });

    expect(repo.update).not.toHaveBeenCalled();
    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({ userId: 'user-1', durationMin: 25 }),
    );
    expect(result.durationMin).toBe(25);
  });

  it('auto-closes an existing active session before creating a new one', async () => {
    const active = makeSession({ id: 'old-sess', endedAt: null });
    repo.findActive.mockResolvedValue(active);
    repo.update.mockResolvedValue({
      ...active,
      endedAt: now,
      completed: false,
    });
    repo.create.mockResolvedValue(
      makeSession({ id: 'new-sess', durationMin: 50 }),
    );

    await useCase.execute({ userId: 'user-1', durationMin: 50 });

    expect(repo.update).toHaveBeenCalledWith(
      'old-sess',
      expect.objectContaining({ completed: false }),
    );
    expect(repo.create).toHaveBeenCalledTimes(1);
  });

  it('passes taskId to the repository when provided', async () => {
    repo.findActive.mockResolvedValue(null);
    repo.create.mockResolvedValue(makeSession({ taskId: 'task-1' }));

    await useCase.execute({
      userId: 'user-1',
      durationMin: 30,
      taskId: 'task-1',
    });

    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({ taskId: 'task-1' }),
    );
  });

  it('returns the created session', async () => {
    const session = makeSession({ id: 'unique-id', durationMin: 15 });
    repo.findActive.mockResolvedValue(null);
    repo.create.mockResolvedValue(session);

    const result = await useCase.execute({ userId: 'user-1', durationMin: 15 });

    expect(result).toBe(session);
  });
});
