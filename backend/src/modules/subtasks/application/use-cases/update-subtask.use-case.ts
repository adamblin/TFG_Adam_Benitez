import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { SubtasksRepository } from '../../domain/repositories/subtasks.repository';
import { TasksRepository } from 'src/modules/tasks/domain/repositories/tasks.repository';
import { XPService } from 'src/modules/xp/application/xp.service';
import { SubtaskEntity } from '../../domain/entities/subtask.entity';
import { UpdateSubtaskInput } from '../inputs/update-subtask.input';

const XP_SUBTASK = 20;
const XP_TASK_COMPLETE = 50;

@Injectable()
export class UpdateSubtaskUseCase {
  constructor(
    private readonly subtasksRepository: SubtasksRepository,
    private readonly tasksRepository: TasksRepository,
    private readonly xpService: XPService,
  ) {}

  async execute(input: UpdateSubtaskInput): Promise<SubtaskEntity> {
    const subtask = await this.subtasksRepository.findById(input.subtaskId);
    if (!subtask) throw new NotFoundException('Subtask not found');

    const task = await this.tasksRepository.findById(subtask.taskId);
    if (!task || task.userId !== input.userId) throw new ForbiddenException('Access denied');

    const title = input.title !== undefined
      ? (input.title.trim() || subtask.title)
      : undefined;

    const updated = await this.subtasksRepository.update(input.subtaskId, {
      ...(title !== undefined ? { title } : {}),
      ...(input.completed !== undefined ? { completed: input.completed } : {}),
      ...(input.order !== undefined ? { order: input.order } : {}),
    });

    if (input.completed !== undefined) {
      if (input.completed) {
        await this.xpService.awardXP(input.userId, XP_SUBTASK);
      }

      const allSiblings = await this.subtasksRepository.findByTaskId(subtask.taskId);
      const allDone = allSiblings.length > 0 && allSiblings.every((s) => s.completed);
      if (allDone !== task.completed) {
        await this.tasksRepository.update(subtask.taskId, {
          completed: allDone,
          completedAt: allDone ? new Date() : null,
        });
        if (allDone) {
          await this.xpService.awardXP(input.userId, XP_TASK_COMPLETE);
        }
      }
    }

    return updated;
  }
}
