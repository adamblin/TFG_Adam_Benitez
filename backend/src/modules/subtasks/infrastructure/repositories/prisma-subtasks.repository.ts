import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { SubtaskEntity } from '../../domain/entities/subtask.entity';
import { SubtasksRepository } from '../../domain/repositories/subtasks.repository';

@Injectable()
export class PrismaSubtasksRepository implements SubtasksRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByTaskId(taskId: string): Promise<SubtaskEntity[]> {
    return this.prisma.subtask.findMany({
      where: { taskId },
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    });
  }

  findById(subtaskId: string): Promise<SubtaskEntity | null> {
    return this.prisma.subtask.findUnique({ where: { id: subtaskId } });
  }

  async createForTask(input: { taskId: string; title: string; order?: number }): Promise<SubtaskEntity> {
    let nextOrder = input.order;
    if (nextOrder === undefined) {
      const last = await this.prisma.subtask.findFirst({
        where: { taskId: input.taskId },
        orderBy: { order: 'desc' },
      });
      nextOrder = (last?.order ?? -1) + 1;
    }
    return this.prisma.subtask.create({
      data: { taskId: input.taskId, title: input.title, order: nextOrder },
    });
  }

  update(subtaskId: string, input: { title?: string; completed?: boolean; order?: number }): Promise<SubtaskEntity> {
    return this.prisma.subtask.update({
      where: { id: subtaskId },
      data: {
        ...(input.title !== undefined ? { title: input.title } : {}),
        ...(input.completed !== undefined ? { completed: input.completed } : {}),
        ...(input.order !== undefined ? { order: input.order } : {}),
      },
    });
  }

  delete(subtaskId: string): Promise<void> {
    return this.prisma.subtask.delete({ where: { id: subtaskId } }).then(() => {});
  }
}
