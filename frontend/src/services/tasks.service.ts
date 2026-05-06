import { apiRequest } from './api.client';

export type Task = { id: string; title: string; done: boolean };

export async function getTasks(): Promise<Task[]> {
  return apiRequest<Task[]>('/tasks');
}
