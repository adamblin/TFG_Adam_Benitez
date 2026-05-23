import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CreateSubtaskUseCase } from './create-subtask.use-case';
import { SubtasksRepository } from '../../domain/repositories/subtasks.repository';
import { TasksRepository } from 'src/modules/tasks/domain/repositories/tasks.repository';
import { SubtaskEntity } from '../../domain/entities/subtask.entity';
import { TaskEntity } from 'src/modules/tasks/domain/entities/task.entity';

const now = new Date();

function makeSubtask(overrides: Partial<SubtaskEntity> = {}): SubtaskEntity {
  return {
    id: 'sub-1',
    taskId: 'task-1',
    title: 'Subtask',
    completed: false,
    order: 0,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

function makeTask(overrides: Partial<TaskEntity> = {}): TaskEntity {
  return {
    id: 'task-1',
    title: 'Task',
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

function makeSubtasksRepo(): jest.Mocked<SubtasksRepository> {
  return {
    findByTaskId: jest.fn(),
    findById: jest.fn(),
    createForTask: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
}

function makeTasksRepo(): jest.Mocked<TasksRepository> {
  return {
    findByUserId: jest.fn(),
    createForUser: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
}

describe('CreateSubtaskUseCase', () => {
  let useCase: CreateSubtaskUseCase;
  let subtasksRepo: jest.Mocked<SubtasksRepository>;
  let tasksRepo: jest.Mocked<TasksRepository>;

  beforeEach(() => {
    subtasksRepo = makeSubtasksRepo();
    tasksRepo = makeTasksRepo();
    useCase = new CreateSubtaskUseCase(subtasksRepo, tasksRepo);
  });

  it('throws NotFoundException when parent task does not exist', async () => {
    tasksRepo.findById.mockResolvedValue(null);
    await expect(
      useCase.execute({ userId: 'user-1', taskId: 'ghost', title: 'x' }),
    ).rejects.toThrow(NotFoundException);
    expect(subtasksRepo.createForTask).not.toHaveBeenCalled();
  });

  it('throws ForbiddenException when task belongs to another user', async () => {
    tasksRepo.findById.mockResolvedValue(makeTask({ userId: 'other-user' }));
    await expect(
      useCase.execute({ userId: 'user-1', taskId: 'task-1', title: 'x' }),
    ).rejects.toThrow(ForbiddenException);
    expect(subtasksRepo.createForTask).not.toHaveBeenCalled();
  });

  it('creates subtask with trimmed title', async () => {
    tasksRepo.findById.mockResolvedValue(makeTask());
    subtasksRepo.createForTask.mockResolvedValue(
      makeSubtask({ title: 'My subtask' }),
    );

    await useCase.execute({
      userId: 'user-1',
      taskId: 'task-1',
      title: '  My subtask  ',
    });

    expect(subtasksRepo.createForTask).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'My subtask', taskId: 'task-1' }),
    );
  });

  it('falls back to "New subtask" when title is blank', async () => {
    tasksRepo.findById.mockResolvedValue(makeTask());
    subtasksRepo.createForTask.mockResolvedValue(
      makeSubtask({ title: 'New subtask' }),
    );

    await useCase.execute({ userId: 'user-1', taskId: 'task-1', title: '   ' });

    expect(subtasksRepo.createForTask).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'New subtask' }),
    );
  });

  it('passes order to the repository', async () => {
    tasksRepo.findById.mockResolvedValue(makeTask());
    subtasksRepo.createForTask.mockResolvedValue(makeSubtask({ order: 3 }));

    await useCase.execute({
      userId: 'user-1',
      taskId: 'task-1',
      title: 'x',
      order: 3,
    });

    expect(subtasksRepo.createForTask).toHaveBeenCalledWith(
      expect.objectContaining({ order: 3 }),
    );
  });
});
