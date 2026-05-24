import { Injectable } from '@nestjs/common';
import { FocusSessionsRepository } from '../../domain/repositories/focus-sessions.repository';
import { FocusSessionEntity } from '../../domain/entities/focus-session.entity';
import { StartSessionInput } from '../inputs/start-session.input';

/** Inicia una nueva sesión de concentración. Si el usuario ya tiene una activa, la cierra automáticamente. */
@Injectable()
export class StartSessionUseCase {
  constructor(private readonly repo: FocusSessionsRepository) {}

  async execute(input: StartSessionInput): Promise<FocusSessionEntity> {
    const active = await this.repo.findActive(input.userId);
    if (active) {
      await this.repo.update(active.id, {
        endedAt: new Date(),
        completed: false,
      });
    }

    return this.repo.create({
      userId: input.userId,
      taskId: input.taskId,
      durationMin: input.durationMin,
    });
  }
}
