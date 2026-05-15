export type FocusSessionEntity = {
  id: string;
  userId: string;
  taskId: string | null;
  durationMin: number;
  startedAt: Date;
  endedAt: Date | null;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
};
