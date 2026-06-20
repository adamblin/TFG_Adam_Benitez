import { apiRequest } from './api.client';

export type LoginResponse = {
  token: string;
  refreshToken: string;
};

export type CurrentUserResponse = {
  id: string;
  username: string;
};

export type RegisterResponse = {
  id: string;
  email: string;
  username: string;
};

export type RefreshResponse = {
  token: string;
  refreshToken: string;
};

export async function login(input: { username: string; password: string }) {
  return apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function register(input: { email: string; username: string; password: string }) {
  return apiRequest<RegisterResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function getCurrentUser(token: string) {
  return apiRequest<CurrentUserResponse>('/auth/me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function refreshSession(input: { refreshToken: string }) {
  return apiRequest<RefreshResponse>('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export type GoogleAuthResponse = {
  token: string;
  refreshToken: string;
  needsUsername: boolean;
};

export async function googleAuth(accessToken: string) {
  return apiRequest<GoogleAuthResponse>('/auth/google', {
    method: 'POST',
    body: JSON.stringify({ accessToken }),
  });
}

export async function completeProfile(username: string) {
  return apiRequest<GoogleAuthResponse>('/auth/complete-profile', {
    method: 'PATCH',
    body: JSON.stringify({ username }),
  });
}
