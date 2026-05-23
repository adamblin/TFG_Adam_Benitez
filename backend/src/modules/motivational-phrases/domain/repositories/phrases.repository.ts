import { PhraseCategory, PhraseEntity } from '../entities/phrase.entity';

export abstract class PhrasesRepository {
  abstract findRandomByCategory(
    category: PhraseCategory,
  ): Promise<PhraseEntity | null>;
}
