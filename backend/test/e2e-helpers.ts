import request from 'supertest';
import { Server } from 'http';

export interface AuthContext {
  token: string;
  userId: string;
  username: string;
  email: string;
}

export async function createAuthContext(
  server: Server | string,
): Promise<AuthContext> {
  const suffix = `${Date.now()}${Math.floor(Math.random() * 10000)}`;
  const email = `test_${suffix}@example.com`;
  const username = `u${suffix}`.slice(0, 20);
  const password = 'TestPass123!';

  const reg = await request(server)
    .post('/auth/register')
    .send({ email, username, password })
    .expect(201);

  const login = await request(server)
    .post('/auth/login')
    .send({ username, password })
    .expect(201);

  return {
    token: login.body.token as string,
    userId: reg.body.id as string,
    username,
    email,
  };
}

export function authHeader(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}` };
}
