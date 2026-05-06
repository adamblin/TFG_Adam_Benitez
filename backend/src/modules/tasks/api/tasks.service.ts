import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';

export interface TaskEntity {
  id: string;
  title: string;
  done: boolean;
}

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async getAll(): Promise<TaskEntity[]> {
    return this.prisma.task.findMany();
  }

  async getById(id: string): Promise<TaskEntity | null> {
    return this.prisma.task.findUnique({ where: { id } });
  }

  async create(title: string): Promise<TaskEntity> {
    return this.prisma.task.create({
      data: { title, done: false },
    });
  }

  async update(
    id: string,
    partial: Partial<TaskEntity>,
  ): Promise<TaskEntity | null> {
    try {
      return await this.prisma.task.update({
        where: { id },
        data: partial,
      });
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.task.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}
