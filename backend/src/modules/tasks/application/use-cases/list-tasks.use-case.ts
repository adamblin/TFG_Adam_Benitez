import { Injectable } from '@nestjs/common';
import { TasksRepository } from '../../domain/repositories/tasks.repository';
import { TaskEntity } from '../../domain/entities/task.entity';

@Injectable()
export class ListTasksUseCase {
  constructor(private readonly tasksRepository: TasksRepository) {}

  execute(userId: string): Promise<TaskEntity[]> {
    return this.tasksRepository.findByUserId(userId);
  }
}
