import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { SubtasksRepository } from '../../domain/repositories/subtasks.repository';
import { TasksRepository } from 'src/modules/tasks/domain/repositories/tasks.repository';
import { SubtaskEntity } from '../../domain/entities/subtask.entity';
import { CreateSubtaskInput } from '../inputs/create-subtask.input';

@Injectable()
export class CreateSubtaskUseCase {
  constructor(
    private readonly subtasksRepository: SubtasksRepository,
    private readonly tasksRepository: TasksRepository,
  ) {}

  async execute(input: CreateSubtaskInput): Promise<SubtaskEntity> {
    const task = await this.tasksRepository.findById(input.taskId);
    if (!task) throw new NotFoundException('Task not found');
    if (task.userId !== input.userId) throw new ForbiddenException('Access denied');

    const title = input.title.trim() || 'New subtask';

    return this.subtasksRepository.createForTask({
      taskId: input.taskId,
      title,
      order: input.order,
    });
  }
}
