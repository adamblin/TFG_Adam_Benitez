import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/infrastructure/prisma/prisma.service';
import { createAuthContext, authHeader, AuthContext } from './e2e-helpers';

describe('SubtaskController (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let auth: AuthContext;
  let taskId: string;

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

    const taskRes = await request(app.getHttpServer())
      .post('/tasks')
      .set(authHeader(auth.token))
      .send({ title: 'Parent task for subtask tests' })
      .expect(201);
    taskId = (taskRes.body as { id: string }).id;
  }, 30000);

  afterAll(async () => {
    await prisma.task.deleteMany({ where: { userId: auth.userId } });
    await prisma.user.deleteMany({ where: { id: auth.userId } });
    await app.close();
  });

  // ── Auth guard ────────────────────────────────────────────────────────────

  it('POST /subtasks – 401 without token', () =>
    request(app.getHttpServer())
      .post('/subtasks')
      .send({ taskId, title: 'x' })
      .expect(401));

  // ── Create ────────────────────────────────────────────────────────────────

  let subtaskId: string;

  it('POST /subtasks – creates a subtask', async () => {
    const res = await request(app.getHttpServer())
      .post('/subtasks')
      .set(authHeader(auth.token))
      .send({ taskId, title: 'First subtask' })
      .expect(201);

    expect(res.body).toMatchObject({
      title: 'First subtask',
      completed: false,
    });
    expect(typeof res.body.id).toBe('string');
    subtaskId = res.body.id as string;
  });

  it('POST /subtasks – creates a second subtask', async () => {
    const res = await request(app.getHttpServer())
      .post('/subtasks')
      .set(authHeader(auth.token))
      .send({ taskId, title: 'Second subtask' })
      .expect(201);
    expect(res.body.title).toBe('Second subtask');
  });

  it('POST /subtasks – rejects missing title (400)', () =>
    request(app.getHttpServer())
      .post('/subtasks')
      .set(authHeader(auth.token))
      .send({ taskId })
      .expect(400));

  // ── List ──────────────────────────────────────────────────────────────────

  it('GET /subtasks/task/:taskId – lists all subtasks', async () => {
    const res = await request(app.getHttpServer())
      .get(`/subtasks/task/${taskId}`)
      .set(authHeader(auth.token))
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect((res.body as Array<{ id: string }>).length).toBeGreaterThanOrEqual(
      2,
    );
  });

  // ── Get by id ─────────────────────────────────────────────────────────────

  it('GET /subtasks/:id – returns the subtask', async () => {
    const res = await request(app.getHttpServer())
      .get(`/subtasks/${subtaskId}`)
      .set(authHeader(auth.token))
      .expect(200);
    expect(res.body).toMatchObject({ id: subtaskId, title: 'First subtask' });
  });

  // ── Update title ──────────────────────────────────────────────────────────

  it('PATCH /subtasks/:id – updates title', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/subtasks/${subtaskId}`)
      .set(authHeader(auth.token))
      .send({ title: 'Updated subtask title' })
      .expect(200);
    expect(res.body.title).toBe('Updated subtask title');
  });

  // ── Toggle completed ──────────────────────────────────────────────────────

  it('PATCH /subtasks/:id – marks subtask as completed', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/subtasks/${subtaskId}`)
      .set(authHeader(auth.token))
      .send({ completed: true })
      .expect(200);
    expect(res.body.completed).toBe(true);
  });

  it('PATCH /subtasks/:id – uncompletes a subtask', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/subtasks/${subtaskId}`)
      .set(authHeader(auth.token))
      .send({ completed: false })
      .expect(200);
    expect(res.body.completed).toBe(false);
  });

  // ── Delete ────────────────────────────────────────────────────────────────

  it('DELETE /subtasks/:id – deletes the subtask', () =>
    request(app.getHttpServer())
      .delete(`/subtasks/${subtaskId}`)
      .set(authHeader(auth.token))
      .expect(204));

  it('GET /subtasks/:id – 404 after deletion', () =>
    request(app.getHttpServer())
      .get(`/subtasks/${subtaskId}`)
      .set(authHeader(auth.token))
      .expect(404));
});
