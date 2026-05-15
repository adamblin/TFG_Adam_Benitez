import { Injectable } from '@nestjs/common';
import { StartSessionUseCase } from './use-cases/start-session.use-case';
import { EndSessionUseCase, EndSessionResult } from './use-cases/end-session.use-case';
import { ListSessionsUseCase } from './use-cases/list-sessions.use-case';
import { FocusSessionEntity } from '../domain/entities/focus-session.entity';

@Injectable()
export class FocusSessionsService {
  constructor(
    private readonly startSessionUseCase: StartSessionUseCase,
    private readonly endSessionUseCase: EndSessionUseCase,
    private readonly listSessionsUseCase: ListSessionsUseCase,
  ) {}

  startSession(
    userId: string,
    dto: { durationMin: number; taskId?: string },
  ): Promise<FocusSessionEntity> {
    return this.startSessionUseCase.execute({
      userId,
      durationMin: dto.durationMin,
      taskId: dto.taskId,
    });
  }

  endSession(
    userId: string,
    dto: { sessionId: string; completed: boolean },
  ): Promise<EndSessionResult> {
    return this.endSessionUseCase.execute({
      userId,
      sessionId: dto.sessionId,
      completed: dto.completed,
    });
  }

  listSessions(userId: string): Promise<FocusSessionEntity[]> {
    return this.listSessionsUseCase.execute(userId);
  }
}
