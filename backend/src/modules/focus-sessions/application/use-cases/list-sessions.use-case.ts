import { Injectable } from '@nestjs/common';
import { FocusSessionsRepository } from '../../domain/repositories/focus-sessions.repository';
import { FocusSessionEntity } from '../../domain/entities/focus-session.entity';

/** Devuelve todas las sesiones de concentración de un usuario ordenadas por fecha. */
@Injectable()
export class ListSessionsUseCase {
  constructor(private readonly repo: FocusSessionsRepository) {}

  execute(userId: string): Promise<FocusSessionEntity[]> {
    return this.repo.findByUserId(userId);
  }
}
