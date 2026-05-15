export type SubtaskInTask = {
  id: string;
  title: string;
  completed: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

export type TaskEntity = {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  completedAt: Date | null;
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  subtasks: SubtaskInTask[];
};
