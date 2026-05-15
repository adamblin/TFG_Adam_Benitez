import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { TaskEntity } from '../../domain/entities/task.entity';
import { TasksRepository } from '../../domain/repositories/tasks.repository';

const SUBTASK_ORDER = { orderBy: [{ order: 'asc' as const }, { createdAt: 'asc' as const }] };

@Injectable()
export class PrismaTasksRepository implements TasksRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByUserId(userId: string): Promise<TaskEntity[]> {
    return this.prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { subtasks: SUBTASK_ORDER },
    }) as Promise<TaskEntity[]>;
  }

  createForUser(input: {
    userId: string;
    title: string;
    description?: string | null;
    dueDate?: Date;
  }): Promise<TaskEntity> {
    return this.prisma.task.create({
      data: {
        userId: input.userId,
        title: input.title,
        description: input.description ?? null,
        dueDate: input.dueDate,
      },
      include: { subtasks: SUBTASK_ORDER },
    }) as Promise<TaskEntity>;
  }

  findById(taskId: string): Promise<TaskEntity | null> {
    return this.prisma.task.findUnique({
      where: { id: taskId },
      include: { subtasks: SUBTASK_ORDER },
    }) as Promise<TaskEntity | null>;
  }

  update(
    taskId: string,
    input: { title?: string; description?: string | null; completed?: boolean; completedAt?: Date | null; dueDate?: Date | null },
  ): Promise<TaskEntity> {
    return this.prisma.task.update({
      where: { id: taskId },
      data: {
        ...(input.title !== undefined ? { title: input.title } : {}),
        ...(input.description !== undefined ? { description: input.description } : {}),
        ...(input.completed !== undefined ? { completed: input.completed } : {}),
        ...(input.completedAt !== undefined ? { completedAt: input.completedAt } : {}),
        ...(input.dueDate !== undefined ? { dueDate: input.dueDate } : {}),
      },
      include: { subtasks: SUBTASK_ORDER },
    }) as Promise<TaskEntity>;
  }

  delete(taskId: string): Promise<void> {
    return this.prisma.task.delete({ where: { id: taskId } }).then(() => {});
  }
}
