import { Injectable } from '@nestjs/common';
import { TasksRepository } from '../../domain/repositories/tasks.repository';
import { TaskEntity } from '../../domain/entities/task.entity';
import { CreateTaskInput } from '../inputs/create-task.input';

@Injectable()
export class CreateTaskUseCase {
  constructor(private readonly tasksRepository: TasksRepository) {}

  execute(input: CreateTaskInput): Promise<TaskEntity> {
    const title = input.title.trim() || 'Nueva tarea';

    return this.tasksRepository.createForUser({
      userId: input.userId,
      title,
      description: input.description ?? null,
      dueDate: input.dueDate,
    });
  }
}
