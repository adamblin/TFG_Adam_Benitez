import { FocusSessionEntity } from '../../domain/entities/focus-session.entity';
import { SessionResponseDto } from '../dto/session-response.dto';

export class SessionResponseMapper {
  static toDto(session: FocusSessionEntity): SessionResponseDto {
    return {
      id: session.id,
      userId: session.userId,
      taskId: session.taskId,
      durationMin: session.durationMin,
      startedAt: session.startedAt.toISOString(),
      endedAt: session.endedAt ? session.endedAt.toISOString() : null,
      completed: session.completed,
      createdAt: session.createdAt.toISOString(),
      updatedAt: session.updatedAt.toISOString(),
    };
  }
}
