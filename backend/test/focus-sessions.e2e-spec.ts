import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/infrastructure/prisma/prisma.service';
import { createAuthContext, authHeader, AuthContext } from './e2e-helpers';

describe('FocusSessionsController (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let auth: AuthContext;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ transform: true, whitelist: true }),
    );
    await app.init();
    prisma = module.get<PrismaService>(PrismaService);

    auth = await createAuthContext(app.getHttpServer());
  }, 30000);

  afterAll(async () => {
    await prisma.focusSession.deleteMany({ where: { userId: auth.userId } });
    await prisma.user.deleteMany({ where: { id: auth.userId } });
    await app.close();
  });

  // ── Auth guard ────────────────────────────────────────────────────────────

  it('POST /focus/start – 401 without token', () =>
    request(app.getHttpServer())
      .post('/focus/start')
      .send({ durationMin: 25 })
      .expect(401));

  it('GET /focus/sessions – 401 without token', () =>
    request(app.getHttpServer()).get('/focus/sessions').expect(401));

  // ── List (empty) ──────────────────────────────────────────────────────────

  it('GET /focus/sessions – empty initially', async () => {
    const res = await request(app.getHttpServer())
      .get('/focus/sessions')
      .set(authHeader(auth.token))
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // ── Start session ─────────────────────────────────────────────────────────

  let sessionId: string;

  it('POST /focus/start – starts a 25-min session', async () => {
    const res = await request(app.getHttpServer())
      .post('/focus/start')
      .set(authHeader(auth.token))
      .send({ durationMin: 25 })
      .expect(201);

    expect(res.body).toMatchObject({ durationMin: 25, endedAt: null });
    expect(typeof res.body.id).toBe('string');
    sessionId = res.body.id as string;
  });

  it('POST /focus/start – rejects invalid duration (0 min)', () =>
    request(app.getHttpServer())
      .post('/focus/start')
      .set(authHeader(auth.token))
      .send({ durationMin: 0 })
      .expect(400));

  it('POST /focus/start – rejects duration over 180 min', () =>
    request(app.getHttpServer())
      .post('/focus/start')
      .set(authHeader(auth.token))
      .send({ durationMin: 181 })
      .expect(400));

  // ── List after start ──────────────────────────────────────────────────────

  it('GET /focus/sessions – includes the active session', async () => {
    const res = await request(app.getHttpServer())
      .get('/focus/sessions')
      .set(authHeader(auth.token))
      .expect(200);
    const ids = (res.body as Array<{ id: string }>).map((s) => s.id);
    expect(ids).toContain(sessionId);
  });

  // ── End session ───────────────────────────────────────────────────────────

  it('POST /focus/end – ends the session as completed', async () => {
    const res = await request(app.getHttpServer())
      .post('/focus/end')
      .set(authHeader(auth.token))
      .send({ sessionId, completed: true })
      .expect(200);

    expect(res.body.session).toMatchObject({ id: sessionId });
    expect(res.body.session.endedAt).not.toBeNull();
    expect(typeof res.body.message).toBe('string');
  });

  it('POST /focus/end – re-ending an already-ended session is idempotent (200)', () =>
    request(app.getHttpServer())
      .post('/focus/end')
      .set(authHeader(auth.token))
      .send({ sessionId, completed: false })
      .expect(200));

  // ── Start with linked task ────────────────────────────────────────────────

  it('POST /focus/start – starts a session linked to a task', async () => {
    const taskRes = await request(app.getHttpServer())
      .post('/tasks')
      .set(authHeader(auth.token))
      .send({ title: 'Focus test task' })
      .expect(201);

    const res = await request(app.getHttpServer())
      .post('/focus/start')
      .set(authHeader(auth.token))
      .send({ durationMin: 15, taskId: (taskRes.body as { id: string }).id })
      .expect(201);

    expect(res.body.taskId).toBe((taskRes.body as { id: string }).id);

    await request(app.getHttpServer())
      .delete(`/tasks/${(taskRes.body as { id: string }).id}`)
      .set(authHeader(auth.token));
  });
});
