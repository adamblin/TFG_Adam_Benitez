import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { TasksRepository } from '../../domain/repositories/tasks.repository';
import { TaskEntity } from '../../domain/entities/task.entity';

@Injectable()
export class GetTaskByIdUseCase {
  constructor(private readonly tasksRepository: TasksRepository) {}

  async execute(userId: string, taskId: string): Promise<TaskEntity> {
    const task = await this.tasksRepository.findById(taskId);
    if (!task) throw new NotFoundException('Task not found');
    if (task.userId !== userId) throw new ForbiddenException('Access denied');

    return task;
  }
}
