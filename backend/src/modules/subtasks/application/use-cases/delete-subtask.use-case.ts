import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { SubtasksRepository } from '../../domain/repositories/subtasks.repository';
import { TasksRepository } from 'src/modules/tasks/domain/repositories/tasks.repository';

@Injectable()
export class DeleteSubtaskUseCase {
  constructor(
    private readonly subtasksRepository: SubtasksRepository,
    private readonly tasksRepository: TasksRepository,
  ) {}

  async execute(userId: string, subtaskId: string): Promise<void> {
    const subtask = await this.subtasksRepository.findById(subtaskId);
    if (!subtask) throw new NotFoundException('Subtask not found');

    const task = await this.tasksRepository.findById(subtask.taskId);
    if (!task || task.userId !== userId) throw new ForbiddenException('Access denied');

    await this.subtasksRepository.delete(subtaskId);
  }
}
