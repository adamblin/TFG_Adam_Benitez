import { SubtaskEntity } from '../../domain/entities/subtask.entity';
import { SubtaskResponseDto } from '../dto/subtask-response.dto';

export class SubtaskResponseMapper {
  static toDto(subtask: SubtaskEntity): SubtaskResponseDto {
    return {
      id: subtask.id,
      taskId: subtask.taskId,
      title: subtask.title,
      completed: subtask.completed,
      order: subtask.order,
      createdAt: subtask.createdAt.toISOString(),
      updatedAt: subtask.updatedAt.toISOString(),
    };
  }
}
