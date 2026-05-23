import { apiRequest } from './api.client';

export type PhraseCategory = 'TASK' | 'SUBTASK' | 'FOCUS';

export type Phrase = {
  id: string;
  text: string;
  category: PhraseCategory;
};

export function getRandomPhrase(category: PhraseCategory): Promise<Phrase> {
  return apiRequest<Phrase>(`/motivational-phrases/random?category=${category}`);
}
