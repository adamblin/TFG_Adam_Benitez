import { Injectable } from '@nestjs/common';
import { FocusSessionsRepository } from '../../domain/repositories/focus-sessions.repository';
import { FocusSessionEntity } from '../../domain/entities/focus-session.entity';

@Injectable()
export class ListSessionsUseCase {
  constructor(private readonly repo: FocusSessionsRepository) {}

  execute(userId: string): Promise<FocusSessionEntity[]> {
    return this.repo.findByUserId(userId);
  }
}
