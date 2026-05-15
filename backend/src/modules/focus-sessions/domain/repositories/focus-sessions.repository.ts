import { FocusSessionEntity } from '../entities/focus-session.entity';

export abstract class FocusSessionsRepository {
  abstract findByUserId(userId: string): Promise<FocusSessionEntity[]>;
  abstract findById(sessionId: string): Promise<FocusSessionEntity | null>;
  abstract findActive(userId: string): Promise<FocusSessionEntity | null>;
  abstract countCompletedToday(userId: string): Promise<number>;
  abstract create(input: {
    userId: string;
    taskId?: string;
    durationMin: number;
  }): Promise<FocusSessionEntity>;
  abstract update(
    sessionId: string,
    input: { endedAt?: Date; completed?: boolean },
  ): Promise<FocusSessionEntity>;
}
