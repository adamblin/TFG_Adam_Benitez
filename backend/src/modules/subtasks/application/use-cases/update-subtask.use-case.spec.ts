import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { UpdateSubtaskUseCase } from './update-subtask.use-case';
import { SubtasksRepository } from '../../domain/repositories/subtasks.repository';
import { TasksRepository } from 'src/modules/tasks/domain/repositories/tasks.repository';
import { XPService } from 'src/modules/xp/application/xp.service';
import { StreaksService } from 'src/modules/streaks/application/streaks.service';
import { SubtaskEntity } from '../../domain/entities/subtask.entity';
import { TaskEntity } from 'src/modules/tasks/domain/entities/task.entity';

const now = new Date();

function makeSub(o: Partial<SubtaskEntity> = {}): SubtaskEntity {
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
function makeSubsRepo(): jest.Mocked<SubtasksRepository> {
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
function makeXpService(): jest.Mocked<XPService> {
  return {
    getLevelInfo: jest.fn(),
    awardXP: jest.fn(),
    spendCoins: jest.fn(),
  } as unknown as jest.Mocked<XPService>;
}
function makeStreaksService(): jest.Mocked<StreaksService> {
  return {
    getStreak: jest.fn(),
    recordActivity: jest
      .fn()
      .mockResolvedValue({ streak: {}, isNewRecord: false }),
  } as unknown as jest.Mocked<StreaksService>;
}

describe('UpdateSubtaskUseCase', () => {
  let useCase: UpdateSubtaskUseCase;
  let subsRepo: jest.Mocked<SubtasksRepository>;
  let tasksRepo: jest.Mocked<TasksRepository>;
  let xpService: jest.Mocked<XPService>;
  let streaksService: jest.Mocked<StreaksService>;

  beforeEach(() => {
    subsRepo = makeSubsRepo();
    tasksRepo = makeTasksRepo();
    xpService = makeXpService();
    streaksService = makeStreaksService();
    useCase = new UpdateSubtaskUseCase(
      subsRepo,
      tasksRepo,
      xpService,
      streaksService,
    );
  });

  it('throws NotFoundException when subtask does not exist', async () => {
    subsRepo.findById.mockResolvedValue(null);
    await expect(
      useCase.execute({ userId: 'user-1', subtaskId: 'ghost', title: 'x' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws ForbiddenException when parent task belongs to another user', async () => {
    subsRepo.findById.mockResolvedValue(makeSub());
    tasksRepo.findById.mockResolvedValue(makeTask({ userId: 'other-user' }));
    await expect(
      useCase.execute({ userId: 'user-1', subtaskId: 'sub-1', title: 'x' }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('updates title with trimmed value', async () => {
    subsRepo.findById.mockResolvedValue(makeSub());
    tasksRepo.findById.mockResolvedValue(makeTask());
    subsRepo.update.mockResolvedValue(makeSub({ title: 'New title' }));

    await useCase.execute({
      userId: 'user-1',
      subtaskId: 'sub-1',
      title: '  New title  ',
    });

    expect(subsRepo.update).toHaveBeenCalledWith(
      'sub-1',
      expect.objectContaining({ title: 'New title' }),
    );
  });

  it('keeps original title when new title is blank', async () => {
    subsRepo.findById.mockResolvedValue(makeSub({ title: 'Keep me' }));
    tasksRepo.findById.mockResolvedValue(makeTask());
    subsRepo.update.mockResolvedValue(makeSub({ title: 'Keep me' }));

    await useCase.execute({
      userId: 'user-1',
      subtaskId: 'sub-1',
      title: '  ',
    });

    expect(subsRepo.update).toHaveBeenCalledWith(
      'sub-1',
      expect.objectContaining({ title: 'Keep me' }),
    );
  });

  it('awards 20 XP when marking subtask as completed', async () => {
    subsRepo.findById.mockResolvedValue(makeSub({ completed: false }));
    tasksRepo.findById.mockResolvedValue(makeTask());
    subsRepo.update.mockResolvedValue(makeSub({ completed: true }));
    subsRepo.findByTaskId.mockResolvedValue([makeSub({ completed: true })]);
    tasksRepo.update.mockResolvedValue(makeTask({ completed: true }));
    xpService.awardXP.mockResolvedValue({
      totalXp: 20,
      level: 1,
      xpInLevel: 20,
      xpToNextLevel: 200,
      progressPercent: 10,
      coins: 0,
    });

    await useCase.execute({
      userId: 'user-1',
      subtaskId: 'sub-1',
      completed: true,
    });

    expect(xpService.awardXP).toHaveBeenCalledWith('user-1', 20);
  });

  it('auto-completes parent task when all siblings are done', async () => {
    subsRepo.findById.mockResolvedValue(makeSub({ completed: false }));
    tasksRepo.findById.mockResolvedValue(makeTask({ completed: false }));
    subsRepo.update.mockResolvedValue(makeSub({ completed: true }));
    subsRepo.findByTaskId.mockResolvedValue([
      makeSub({ id: 'sub-1', completed: true }),
      makeSub({ id: 'sub-2', completed: true }),
    ]);
    tasksRepo.update.mockResolvedValue(makeTask({ completed: true }));
    xpService.awardXP.mockResolvedValue({
      totalXp: 70,
      level: 1,
      xpInLevel: 70,
      xpToNextLevel: 200,
      progressPercent: 35,
      coins: 0,
    });

    await useCase.execute({
      userId: 'user-1',
      subtaskId: 'sub-1',
      completed: true,
    });

    expect(tasksRepo.update).toHaveBeenCalledWith(
      'task-1',
      expect.objectContaining({ completed: true }),
    );
    expect(xpService.awardXP).toHaveBeenCalledWith('user-1', 50);
  });

  it('does not award XP when uncompleting a subtask', async () => {
    subsRepo.findById.mockResolvedValue(makeSub({ completed: true }));
    tasksRepo.findById.mockResolvedValue(makeTask());
    subsRepo.update.mockResolvedValue(makeSub({ completed: false }));
    subsRepo.findByTaskId.mockResolvedValue([makeSub({ completed: false })]);

    await useCase.execute({
      userId: 'user-1',
      subtaskId: 'sub-1',
      completed: false,
    });

    expect(xpService.awardXP).not.toHaveBeenCalled();
  });

  it('does not touch title when only completed is passed', async () => {
    subsRepo.findById.mockResolvedValue(makeSub());
    tasksRepo.findById.mockResolvedValue(makeTask());
    subsRepo.update.mockResolvedValue(makeSub({ completed: true }));
    subsRepo.findByTaskId.mockResolvedValue([makeSub({ completed: true })]);
    tasksRepo.update.mockResolvedValue(makeTask({ completed: true }));
    xpService.awardXP.mockResolvedValue({
      totalXp: 20,
      level: 1,
      xpInLevel: 20,
      xpToNextLevel: 200,
      progressPercent: 10,
      coins: 0,
    });

    await useCase.execute({
      userId: 'user-1',
      subtaskId: 'sub-1',
      completed: true,
    });

    const updateArg = subsRepo.update.mock.calls[0]?.[1];
    expect(updateArg).not.toHaveProperty('title');
  });
});
