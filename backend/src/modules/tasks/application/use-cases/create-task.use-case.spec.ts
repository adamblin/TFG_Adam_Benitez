import { CreateTaskUseCase } from './create-task.use-case';
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

describe('CreateTaskUseCase', () => {
  let useCase: CreateTaskUseCase;
  let repo: jest.Mocked<TasksRepository>;

  beforeEach(() => {
    repo = makeRepo();
    useCase = new CreateTaskUseCase(repo);
  });

  it('creates a task with the trimmed title', async () => {
    repo.createForUser.mockResolvedValue(makeTask({ title: 'Buy groceries' }));

    const result = await useCase.execute({
      userId: 'user-1',
      title: '  Buy groceries  ',
    });

    expect(repo.createForUser).toHaveBeenCalledWith(
      expect.objectContaining({ userId: 'user-1', title: 'Buy groceries' }),
    );
    expect(result.title).toBe('Buy groceries');
  });

  it('falls back to "Nueva tarea" when title is blank whitespace', async () => {
    repo.createForUser.mockResolvedValue(makeTask({ title: 'Nueva tarea' }));

    await useCase.execute({ userId: 'user-1', title: '   ' });

    expect(repo.createForUser).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Nueva tarea' }),
    );
  });

  it('passes dueDate to the repository', async () => {
    const due = new Date('2099-12-31');
    repo.createForUser.mockResolvedValue(makeTask({ dueDate: due }));

    await useCase.execute({ userId: 'user-1', title: 'Task', dueDate: due });

    expect(repo.createForUser).toHaveBeenCalledWith(
      expect.objectContaining({ dueDate: due }),
    );
  });

  it('passes description to the repository', async () => {
    repo.createForUser.mockResolvedValue(
      makeTask({ description: 'Some details' }),
    );

    await useCase.execute({
      userId: 'user-1',
      title: 'Task',
      description: 'Some details',
    });

    expect(repo.createForUser).toHaveBeenCalledWith(
      expect.objectContaining({ description: 'Some details' }),
    );
  });

  it('returns exactly what the repository resolves', async () => {
    const task = makeTask({ id: 'unique-id' });
    repo.createForUser.mockResolvedValue(task);

    const result = await useCase.execute({ userId: 'user-1', title: 'Task' });

    expect(result).toBe(task);
  });
});
