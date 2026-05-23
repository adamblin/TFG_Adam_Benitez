import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { DeleteSubtaskUseCase } from './delete-subtask.use-case';
import { SubtasksRepository } from '../../domain/repositories/subtasks.repository';
import { TasksRepository } from 'src/modules/tasks/domain/repositories/tasks.repository';
import { SubtaskEntity } from '../../domain/entities/subtask.entity';
import { TaskEntity } from 'src/modules/tasks/domain/entities/task.entity';

const now = new Date();

function makeSubtask(o: Partial<SubtaskEntity> = {}): SubtaskEntity {
  return {
    id: 'sub-1',
    taskId: 'task-1',
    title: 'Sub',
    completed: false,
    order: 0,
    createdAt: now,
    updatedAt: now,
    ...o,
  };
}
function makeTask(o: Partial<TaskEntity> = {}): TaskEntity {
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
    ...o,
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

describe('DeleteSubtaskUseCase', () => {
  let useCase: DeleteSubtaskUseCase;
  let subtasksRepo: jest.Mocked<SubtasksRepository>;
  let tasksRepo: jest.Mocked<TasksRepository>;

  beforeEach(() => {
    subtasksRepo = makeSubtasksRepo();
    tasksRepo = makeTasksRepo();
    useCase = new DeleteSubtaskUseCase(subtasksRepo, tasksRepo);
  });

  it('throws NotFoundException when subtask does not exist', async () => {
    subtasksRepo.findById.mockResolvedValue(null);
    await expect(useCase.execute('user-1', 'ghost')).rejects.toThrow(
      NotFoundException,
    );
    expect(subtasksRepo.delete).not.toHaveBeenCalled();
  });

  it('throws ForbiddenException when parent task belongs to another user', async () => {
    subtasksRepo.findById.mockResolvedValue(makeSubtask());
    tasksRepo.findById.mockResolvedValue(makeTask({ userId: 'other-user' }));
    await expect(useCase.execute('user-1', 'sub-1')).rejects.toThrow(
      ForbiddenException,
    );
    expect(subtasksRepo.delete).not.toHaveBeenCalled();
  });

  it('throws ForbiddenException when parent task is not found', async () => {
    subtasksRepo.findById.mockResolvedValue(makeSubtask());
    tasksRepo.findById.mockResolvedValue(null);
    await expect(useCase.execute('user-1', 'sub-1')).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('deletes the subtask when owner calls it', async () => {
    subtasksRepo.findById.mockResolvedValue(makeSubtask());
    tasksRepo.findById.mockResolvedValue(makeTask());
    subtasksRepo.delete.mockResolvedValue(undefined);

    await useCase.execute('user-1', 'sub-1');

    expect(subtasksRepo.delete).toHaveBeenCalledWith('sub-1');
    expect(subtasksRepo.delete).toHaveBeenCalledTimes(1);
  });
});
