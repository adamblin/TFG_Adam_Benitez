export type PhraseCategory = 'TASK' | 'SUBTASK' | 'FOCUS';

export type PhraseEntity = {
  id: string;
  text: string;
  category: PhraseCategory;
  createdAt: Date;
};
