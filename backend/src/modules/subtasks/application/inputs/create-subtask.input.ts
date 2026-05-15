export type CreateSubtaskInput = {
  userId: string;
  taskId: string;
  title: string;
  order?: number;
};
