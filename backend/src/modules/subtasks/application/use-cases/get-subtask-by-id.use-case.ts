import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { SubtasksRepository } from '../../domain/repositories/subtasks.repository';
import { TasksRepository } from 'src/modules/tasks/domain/repositories/tasks.repository';
import { SubtaskEntity } from '../../domain/entities/subtask.entity';

@Injectable()
export class GetSubtaskByIdUseCase {
  constructor(
    private readonly subtasksRepository: SubtasksRepository,
    private readonly tasksRepository: TasksRepository,
  ) {}

  async execute(userId: string, subtaskId: string): Promise<SubtaskEntity> {
    const subtask = await this.subtasksRepository.findById(subtaskId);
    if (!subtask) throw new NotFoundException('Subtask not found');

    const task = await this.tasksRepository.findById(subtask.taskId);
    if (!task || task.userId !== userId) throw new ForbiddenException('Access denied');

    return subtask;
  }
}
