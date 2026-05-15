import { TaskEntity } from '../../domain/entities/task.entity';
import { TaskResponseDto } from '../dto/task-response.dto';

export class TaskResponseMapper {
  static toDto(task: TaskEntity): TaskResponseDto {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      completed: task.completed,
      completedAt: task.completedAt ? task.completedAt.toISOString() : null,
      dueDate: task.dueDate ? task.dueDate.toISOString() : null,
      subtasks: (task.subtasks ?? []).map((s) => ({
        id: s.id,
        title: s.title,
        completed: s.completed,
        order: s.order,
        createdAt: s.createdAt.toISOString(),
        updatedAt: s.updatedAt.toISOString(),
      })),
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
    };
  }
}
