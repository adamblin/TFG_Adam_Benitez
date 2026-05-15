export type UpdateSubtaskInput = {
  userId: string;
  subtaskId: string;
  title?: string;
  completed?: boolean;
  order?: number;
};
