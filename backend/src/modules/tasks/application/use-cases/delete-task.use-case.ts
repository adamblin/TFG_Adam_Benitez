import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { TasksRepository } from '../../domain/repositories/tasks.repository';

/** Elimina una tarea y todas sus subtareas, verificando que el usuario sea propietario. */
@Injectable()
export class DeleteTaskUseCase {
  constructor(private readonly tasksRepository: TasksRepository) {}

  async execute(userId: string, taskId: string): Promise<void> {
    const task = await this.tasksRepository.findById(taskId);
    if (!task) throw new NotFoundException('Task not found');
    if (task.userId !== userId) throw new ForbiddenException('Access denied');

    await this.tasksRepository.delete(taskId);
  }
}
