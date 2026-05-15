export type CreateTaskInput = {
  userId: string;
  title: string;
  description?: string | null;
  dueDate?: Date;
};
