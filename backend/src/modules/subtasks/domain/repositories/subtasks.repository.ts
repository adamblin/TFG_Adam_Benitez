import { SubtaskEntity } from '../entities/subtask.entity';

export abstract class SubtasksRepository {
  abstract findByTaskId(taskId: string): Promise<SubtaskEntity[]>;
  abstract findById(subtaskId: string): Promise<SubtaskEntity | null>;
  abstract createForTask(input: { taskId: string; title: string; order?: number }): Promise<SubtaskEntity>;
  abstract update(subtaskId: string, input: { title?: string; completed?: boolean; order?: number }): Promise<SubtaskEntity>;
  abstract delete(subtaskId: string): Promise<void>;
}
