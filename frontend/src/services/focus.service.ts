import { apiRequest } from './api.client';

export type FocusSession = {
  id: string;
  userId: string;
  taskId: string | null;
  durationMin: number;
  startedAt: string;
  endedAt: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

export type EndSessionResponse = {
  session: FocusSession;
  message: string;
};

export function startFocusSession(data: {
  durationMin: number;
  taskId?: string | null;
}): Promise<FocusSession> {
  return apiRequest<FocusSession>('/focus/start', {
    method: 'POST',
    body: JSON.stringify({ durationMin: data.durationMin, taskId: data.taskId ?? null }),
  });
}

export function endFocusSession(data: {
  sessionId: string;
  completed: boolean;
}): Promise<EndSessionResponse> {
  return apiRequest<EndSessionResponse>('/focus/end', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function getFocusSessions(): Promise<FocusSession[]> {
  return apiRequest<FocusSession[]>('/focus/sessions');
}
