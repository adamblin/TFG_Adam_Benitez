import { ListTasksUseCase } from './list-tasks.use-case';
import { TasksRepository } from '../../domain/repositories/tasks.repository';
import { TaskEntity } from '../../domain/entities/task.entity';

const now = new Date();

function makeTask(overrides: Partial<TaskEntity> = {}): TaskEntity {
  return {
    id: 'task-1',
    title: 'Test task',
    description: null,
    completed: false,
    completedAt: null,
    dueDate: null,
    createdAt: now,
    updatedAt: now,
    userId: 'user-1',
    subtasks: [],
    ...overrides,
  };
}

function makeRepo(): jest.Mocked<TasksRepository> {
  return {
    findByUserId: jest.fn(),
    createForUser: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
}

describe('ListTasksUseCase', () => {
  let useCase: ListTasksUseCase;
  let repo: jest.Mocked<TasksRepository>;

  beforeEach(() => {
    repo = makeRepo();
    useCase = new ListTasksUseCase(repo);
  });

  it('returns an empty array when user has no tasks', async () => {
    repo.findByUserId.mockResolvedValue([]);

    const result = await useCase.execute('user-1');

    expect(result).toEqual([]);
    expect(repo.findByUserId).toHaveBeenCalledWith('user-1');
  });

  it('returns all tasks for the given user', async () => {
    const tasks = [
      makeTask({ id: 'task-1', title: 'Task A' }),
      makeTask({ id: 'task-2', title: 'Task B' }),
    ];
    repo.findByUserId.mockResolvedValue(tasks);

    const result = await useCase.execute('user-1');

    expect(result).toHaveLength(2);
    expect(result[0].title).toBe('Task A');
    expect(result[1].title).toBe('Task B');
  });

  it('only queries tasks for the given userId', async () => {
    repo.findByUserId.mockResolvedValue([]);

    await useCase.execute('specific-user');

    expect(repo.findByUserId).toHaveBeenCalledWith('specific-user');
    expect(repo.findByUserId).toHaveBeenCalledTimes(1);
  });
});
