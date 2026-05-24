import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { SubtasksRepository } from '../../domain/repositories/subtasks.repository';
import { TasksRepository } from 'src/modules/tasks/domain/repositories/tasks.repository';
import { SubtaskEntity } from '../../domain/entities/subtask.entity';

@Injectable()
/** Lista todas las subtareas de una tarea verificando que el usuario sea propietario. */
export class ListSubtasksUseCase {
  constructor(
    private readonly subtasksRepository: SubtasksRepository,
    private readonly tasksRepository: TasksRepository,
  ) {}

  async execute(userId: string, taskId: string): Promise<SubtaskEntity[]> {
    const task = await this.tasksRepository.findById(taskId);
    if (!task) throw new NotFoundException('Task not found');
    if (task.userId !== userId) throw new ForbiddenException('Access denied');

    return this.subtasksRepository.findByTaskId(taskId);
  }
}
