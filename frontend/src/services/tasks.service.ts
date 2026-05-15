import { apiRequest } from './api.client';

export type Subtask = {
  id: string;
  title: string;
  completed: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
};

export type Task = {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  completedAt: string | null;
  dueDate: string | null;
  subtasks: Subtask[];
  createdAt: string;
  updatedAt: string;
};

export function getTasks(): Promise<Task[]> {
  return apiRequest<Task[]>('/tasks/me');
}

export function createTask(title: string, dueDate?: string): Promise<Task> {
  return apiRequest<Task>('/tasks', {
    method: 'POST',
    body: JSON.stringify({ title, ...(dueDate ? { dueDate } : {}) }),
  });
}

export function deleteTask(taskId: string): Promise<void> {
  return apiRequest<void>(`/tasks/${taskId}`, { method: 'DELETE' });
}

export function deleteSubtask(subtaskId: string): Promise<void> {
  return apiRequest<void>(`/subtasks/${subtaskId}`, { method: 'DELETE' });
}

export function createSubtask(taskId: string, title: string): Promise<Subtask> {
  return apiRequest<Subtask>('/subtasks', {
    method: 'POST',
    body: JSON.stringify({ taskId, title }),
  });
}

export function updateTask(taskId: string, data: Partial<Pick<Task, 'title' | 'description' | 'completed' | 'dueDate'>>): Promise<Task> {
  return apiRequest<Task>(`/tasks/${taskId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function toggleSubtask(subtaskId: string, completed: boolean): Promise<Subtask> {
  return apiRequest<Subtask>(`/subtasks/${subtaskId}`, {
    method: 'PATCH',
    body: JSON.stringify({ completed }),
  });
}
