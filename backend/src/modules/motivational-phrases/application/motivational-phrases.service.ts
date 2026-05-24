import { Injectable } from '@nestjs/common';
import { PhraseCategory, PhraseEntity } from '../domain/entities/phrase.entity';
import { GetRandomPhraseUseCase } from './use-cases/get-random-phrase.use-case';

/** Expone frases motivacionales aleatorias filtradas por categoría. */
@Injectable()
export class MotivationalPhrasesService {
  constructor(private readonly getRandomPhrase: GetRandomPhraseUseCase) {}

  getRandomByCategory(category: PhraseCategory): Promise<PhraseEntity | null> {
    return this.getRandomPhrase.execute(category);
  }
}
