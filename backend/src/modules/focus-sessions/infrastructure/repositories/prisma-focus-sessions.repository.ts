import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { FocusSessionEntity } from '../../domain/entities/focus-session.entity';
import { FocusSessionsRepository } from '../../domain/repositories/focus-sessions.repository';

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

@Injectable()
export class PrismaFocusSessionsRepository implements FocusSessionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByUserId(userId: string): Promise<FocusSessionEntity[]> {
    return this.prisma.focusSession.findMany({
      where: { userId },
      orderBy: { startedAt: 'desc' },
    });
  }

  findById(sessionId: string): Promise<FocusSessionEntity | null> {
    return this.prisma.focusSession.findUnique({ where: { id: sessionId } });
  }

  findActive(userId: string): Promise<FocusSessionEntity | null> {
    return this.prisma.focusSession.findFirst({
      where: { userId, endedAt: null },
    });
  }

  async countCompletedToday(userId: string): Promise<number> {
    const todayStart = startOfDay(new Date());
    return this.prisma.focusSession.count({
      where: {
        userId,
        completed: true,
        endedAt: { gte: todayStart },
      },
    });
  }

  create(input: {
    userId: string;
    taskId?: string;
    durationMin: number;
  }): Promise<FocusSessionEntity> {
    return this.prisma.focusSession.create({
      data: {
        userId: input.userId,
        taskId: input.taskId ?? null,
        durationMin: input.durationMin,
      },
    });
  }

  update(
    sessionId: string,
    input: { endedAt?: Date; completed?: boolean },
  ): Promise<FocusSessionEntity> {
    return this.prisma.focusSession.update({
      where: { id: sessionId },
      data: {
        ...(input.endedAt !== undefined ? { endedAt: input.endedAt } : {}),
        ...(input.completed !== undefined ? { completed: input.completed } : {}),
      },
    });
  }
}
