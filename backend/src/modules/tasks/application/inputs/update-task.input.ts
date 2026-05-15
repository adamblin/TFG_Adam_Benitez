export type UpdateTaskInput = {
  userId: string;
  taskId: string;
  title?: string;
  description?: string | null;
  completed?: boolean;
  dueDate?: Date | null;
};
