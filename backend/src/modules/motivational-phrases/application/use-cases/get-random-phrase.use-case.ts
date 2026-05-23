import { Injectable } from '@nestjs/common';
import {
  PhraseCategory,
  PhraseEntity,
} from '../../domain/entities/phrase.entity';
import { PhrasesRepository } from '../../domain/repositories/phrases.repository';

@Injectable()
export class GetRandomPhraseUseCase {
  constructor(private readonly phrasesRepository: PhrasesRepository) {}

  execute(category: PhraseCategory): Promise<PhraseEntity | null> {
    return this.phrasesRepository.findRandomByCategory(category);
  }
}
