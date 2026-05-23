import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { UpdateTaskUseCase } from './update-task.use-case';
import { TasksRepository } from '../../domain/repositories/tasks.repository';
import { TaskEntity } from '../../domain/entities/task.entity';

const now = new Date();

function makeTask(overrides: Partial<TaskEntity> = {}): TaskEntity {
  return {
    id: 'task-1',
    title: 'Original title',
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

describe('UpdateTaskUseCase', () => {
  let useCase: UpdateTaskUseCase;
  let repo: jest.Mocked<TasksRepository>;

  beforeEach(() => {
    repo = makeRepo();
    useCase = new UpdateTaskUseCase(repo);
  });

  it('throws NotFoundException when task does not exist', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({ userId: 'user-1', taskId: 'ghost', title: 'x' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws ForbiddenException when task belongs to another user', async () => {
    repo.findById.mockResolvedValue(makeTask({ userId: 'other-user' }));

    await expect(
      useCase.execute({ userId: 'user-1', taskId: 'task-1', title: 'x' }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('updates the title with trimmed value', async () => {
    repo.findById.mockResolvedValue(makeTask());
    repo.update.mockResolvedValue(makeTask({ title: 'New title' }));

    await useCase.execute({
      userId: 'user-1',
      taskId: 'task-1',
      title: '  New title  ',
    });

    expect(repo.update).toHaveBeenCalledWith(
      'task-1',
      expect.objectContaining({ title: 'New title' }),
    );
  });

  it('keeps the original title when new title is blank', async () => {
    repo.findById.mockResolvedValue(makeTask({ title: 'Keep me' }));
    repo.update.mockResolvedValue(makeTask({ title: 'Keep me' }));

    await useCase.execute({ userId: 'user-1', taskId: 'task-1', title: '   ' });

    expect(repo.update).toHaveBeenCalledWith(
      'task-1',
      expect.objectContaining({ title: 'Keep me' }),
    );
  });

  it('sets completedAt when completing a task', async () => {
    repo.findById.mockResolvedValue(makeTask({ completed: false }));
    repo.update.mockResolvedValue(
      makeTask({ completed: true, completedAt: new Date() }),
    );

    await useCase.execute({
      userId: 'user-1',
      taskId: 'task-1',
      completed: true,
    });

    expect(repo.update).toHaveBeenCalledWith(
      'task-1',
      expect.objectContaining({
        completed: true,
        completedAt: expect.any(Date),
      }),
    );
  });

  it('clears completedAt when un-completing a task', async () => {
    repo.findById.mockResolvedValue(
      makeTask({ completed: true, completedAt: now }),
    );
    repo.update.mockResolvedValue(
      makeTask({ completed: false, completedAt: null }),
    );

    await useCase.execute({
      userId: 'user-1',
      taskId: 'task-1',
      completed: false,
    });

    expect(repo.update).toHaveBeenCalledWith(
      'task-1',
      expect.objectContaining({ completed: false, completedAt: null }),
    );
  });

  it('does not touch completedAt when completed flag is unchanged', async () => {
    repo.findById.mockResolvedValue(makeTask({ completed: false }));
    repo.update.mockResolvedValue(makeTask());

    await useCase.execute({
      userId: 'user-1',
      taskId: 'task-1',
      title: 'Changed',
    });

    const updateArg = repo.update.mock.calls[0]?.[1];
    expect(updateArg).not.toHaveProperty('completedAt');
  });

  it('updates dueDate to null when explicitly passed null', async () => {
    repo.findById.mockResolvedValue(makeTask({ dueDate: now }));
    repo.update.mockResolvedValue(makeTask({ dueDate: null }));

    await useCase.execute({
      userId: 'user-1',
      taskId: 'task-1',
      dueDate: null,
    });

    expect(repo.update).toHaveBeenCalledWith(
      'task-1',
      expect.objectContaining({ dueDate: null }),
    );
  });
});
