import { TaskEntity } from '../entities/task.entity';


export abstract class TasksRepository {
  abstract findByUserId(userId: string): Promise<TaskEntity[]>;

  abstract createForUser(input: {
    userId: string;
    title: string;
    description?: string | null;
    dueDate?: Date;
  }): Promise<TaskEntity>;

  abstract findById(taskId: string): Promise<TaskEntity | null>;

  abstract update(
    taskId: string,
    input: {
      title?: string;
      description?: string | null;
      completed?: boolean;
      completedAt?: Date | null;
      dueDate?: Date | null;
    },
  ): Promise<TaskEntity>;

  abstract delete(taskId: string): Promise<void>;
}
