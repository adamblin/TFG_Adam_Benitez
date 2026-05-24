import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { TasksRepository } from '../../domain/repositories/tasks.repository';
import { StreaksService } from 'src/modules/streaks/application/streaks.service';
import { TaskEntity } from '../../domain/entities/task.entity';
import { UpdateTaskInput } from '../inputs/update-task.input';

/** Actualiza campos de una tarea. Registra actividad de racha cuando la tarea pasa a completada. */
@Injectable()
export class UpdateTaskUseCase {
  constructor(
    private readonly tasksRepository: TasksRepository,
    private readonly streaksService: StreaksService,
  ) {}

  async execute(input: UpdateTaskInput): Promise<TaskEntity> {
    const existing = await this.tasksRepository.findById(input.taskId);
    if (!existing) throw new NotFoundException('Task not found');
    if (existing.userId !== input.userId)
      throw new ForbiddenException('Access denied');

    const completedChanged =
      input.completed !== undefined && input.completed !== existing.completed;
    const completedAt = completedChanged
      ? input.completed
        ? new Date()
        : null
      : undefined;

    if (completedChanged && input.completed) {
      await this.streaksService.recordActivity(input.userId);
    }

    return this.tasksRepository.update(input.taskId, {
      ...(input.title !== undefined
        ? { title: input.title.trim() || existing.title }
        : {}),
      ...(input.description !== undefined
        ? { description: input.description }
        : {}),
      ...(input.completed !== undefined ? { completed: input.completed } : {}),
      ...(completedAt !== undefined ? { completedAt } : {}),
      ...(input.dueDate !== undefined ? { dueDate: input.dueDate } : {}),
    });
  }
}
