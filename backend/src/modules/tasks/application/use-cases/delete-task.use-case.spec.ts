import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { DeleteTaskUseCase } from './delete-task.use-case';
import { TasksRepository } from '../../domain/repositories/tasks.repository';
import { TaskEntity } from '../../domain/entities/task.entity';

const now = new Date();

function makeTask(overrides: Partial<TaskEntity> = {}): TaskEntity {
  return {
    id: 'task-1',
    title: 'Task to delete',
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

describe('DeleteTaskUseCase', () => {
  let useCase: DeleteTaskUseCase;
  let repo: jest.Mocked<TasksRepository>;

  beforeEach(() => {
    repo = makeRepo();
    useCase = new DeleteTaskUseCase(repo);
  });

  it('throws NotFoundException when task does not exist', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(useCase.execute('user-1', 'ghost-task')).rejects.toThrow(
      NotFoundException,
    );
    expect(repo.delete).not.toHaveBeenCalled();
  });

  it('throws ForbiddenException when task belongs to another user', async () => {
    repo.findById.mockResolvedValue(makeTask({ userId: 'other-user' }));

    await expect(useCase.execute('user-1', 'task-1')).rejects.toThrow(
      ForbiddenException,
    );
    expect(repo.delete).not.toHaveBeenCalled();
  });

  it('deletes the task when owner calls it', async () => {
    repo.findById.mockResolvedValue(makeTask());
    repo.delete.mockResolvedValue(undefined);

    await useCase.execute('user-1', 'task-1');

    expect(repo.delete).toHaveBeenCalledWith('task-1');
    expect(repo.delete).toHaveBeenCalledTimes(1);
  });

  it('looks up the task by the provided taskId', async () => {
    repo.findById.mockResolvedValue(makeTask({ id: 'task-abc' }));
    repo.delete.mockResolvedValue(undefined);

    await useCase.execute('user-1', 'task-abc');

    expect(repo.findById).toHaveBeenCalledWith('task-abc');
  });
});
