export type SubtaskEntity = {
  id: string;
  taskId: string;
  title: string;
  completed: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
};
