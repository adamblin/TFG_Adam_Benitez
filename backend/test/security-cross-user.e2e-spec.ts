import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/infrastructure/prisma/prisma.service';
import { createAuthContext, authHeader, AuthContext } from './e2e-helpers';

describe('Cross-user security (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let userA: AuthContext;
  let userB: AuthContext;

  let taskAId: string;
  let subtaskAId: string;
  let sessionAId: string;

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

    [userA, userB] = await Promise.all([
      createAuthContext(app.getHttpServer()),
      createAuthContext(app.getHttpServer()),
    ]);

    // Create resources owned by user A
    const taskRes = await request(app.getHttpServer())
      .post('/tasks')
      .set(authHeader(userA.token))
      .send({ title: 'User A task' })
      .expect(201);
    taskAId = (taskRes.body as { id: string }).id;

    const subRes = await request(app.getHttpServer())
      .post('/subtasks')
      .set(authHeader(userA.token))
      .send({ taskId: taskAId, title: 'User A subtask' })
      .expect(201);
    subtaskAId = (subRes.body as { id: string }).id;

    const sessionRes = await request(app.getHttpServer())
      .post('/focus/start')
      .set(authHeader(userA.token))
      .send({ durationMin: 25 })
      .expect(201);
    sessionAId = (sessionRes.body as { id: string }).id;
  }, 30000);

  afterAll(async () => {
    await prisma.task.deleteMany({ where: { userId: userA.userId } });
    await prisma.focusSession.deleteMany({ where: { userId: userA.userId } });
    await prisma.user.deleteMany({
      where: { id: { in: [userA.userId, userB.userId] } },
    });
    await app.close();
  });

  // ── Tasks ─────────────────────────────────────────────────────────────────

  it("GET /tasks/me – user B does not see user A's tasks", async () => {
    const res = await request(app.getHttpServer())
      .get('/tasks/me')
      .set(authHeader(userB.token))
      .expect(200);

    const ids = (res.body as Array<{ id: string }>).map((t) => t.id);
    expect(ids).not.toContain(taskAId);
  });

  it("GET /tasks/:id – user B gets 403 on user A's task", () =>
    request(app.getHttpServer())
      .get(`/tasks/${taskAId}`)
      .set(authHeader(userB.token))
      .expect(403));

  it("PATCH /tasks/:id – user B gets 403 on user A's task", () =>
    request(app.getHttpServer())
      .patch(`/tasks/${taskAId}`)
      .set(authHeader(userB.token))
      .send({ title: 'Hijacked' })
      .expect(403));

  it("DELETE /tasks/:id – user B gets 403 on user A's task", () =>
    request(app.getHttpServer())
      .delete(`/tasks/${taskAId}`)
      .set(authHeader(userB.token))
      .expect(403));

  // ── Subtasks ──────────────────────────────────────────────────────────────

  it("POST /subtasks – user B gets 403 adding subtask to user A's task", () =>
    request(app.getHttpServer())
      .post('/subtasks')
      .set(authHeader(userB.token))
      .send({ taskId: taskAId, title: 'Injected subtask' })
      .expect(403));

  it("GET /subtasks/:id – user B gets 403 on user A's subtask", () =>
    request(app.getHttpServer())
      .get(`/subtasks/${subtaskAId}`)
      .set(authHeader(userB.token))
      .expect(403));

  it("PATCH /subtasks/:id – user B gets 403 on user A's subtask", () =>
    request(app.getHttpServer())
      .patch(`/subtasks/${subtaskAId}`)
      .set(authHeader(userB.token))
      .send({ title: 'Hijacked subtask' })
      .expect(403));

  it("DELETE /subtasks/:id – user B gets 403 on user A's subtask", () =>
    request(app.getHttpServer())
      .delete(`/subtasks/${subtaskAId}`)
      .set(authHeader(userB.token))
      .expect(403));

  // ── Focus sessions ────────────────────────────────────────────────────────

  it("POST /focus/end – user B gets 403 ending user A's session", () =>
    request(app.getHttpServer())
      .post('/focus/end')
      .set(authHeader(userB.token))
      .send({ sessionId: sessionAId, completed: false })
      .expect(403));

  // ── Ownership unchanged after attack ──────────────────────────────────────

  it("user A's task is unchanged after user B's attempts", async () => {
    const res = await request(app.getHttpServer())
      .get(`/tasks/${taskAId}`)
      .set(authHeader(userA.token))
      .expect(200);

    expect(res.body.title).toBe('User A task');
  });
});
