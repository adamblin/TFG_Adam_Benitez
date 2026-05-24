import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/infrastructure/prisma/prisma.service';
import { createAuthContext, authHeader, AuthContext } from './e2e-helpers';

describe('TasksController – full CRUD (e2e)', () => {
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
    await prisma.task.deleteMany({ where: { userId: auth.userId } });
    await prisma.user.deleteMany({ where: { id: auth.userId } });
    await app.close();
  });

  // ── Auth guard ────────────────────────────────────────────────────────────

  it('GET /tasks/me – 401 without token', () =>
    request(app.getHttpServer()).get('/tasks/me').expect(401));

  it('POST /tasks – 401 without token', () =>
    request(app.getHttpServer())
      .post('/tasks')
      .send({ title: 'x' })
      .expect(401));

  // ── List (empty) ──────────────────────────────────────────────────────────

  it('GET /tasks/me – returns empty array initially', async () => {
    const res = await request(app.getHttpServer())
      .get('/tasks/me')
      .set(authHeader(auth.token))
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // ── Create ────────────────────────────────────────────────────────────────

  let taskId: string;

  it('POST /tasks – creates a task', async () => {
    const res = await request(app.getHttpServer())
      .post('/tasks')
      .set(authHeader(auth.token))
      .send({ title: 'Write unit tests', dueDate: '2099-12-31' })
      .expect(201);

    expect(res.body).toMatchObject({
      title: 'Write unit tests',
      completed: false,
    });
    expect(typeof res.body.id).toBe('string');
    taskId = res.body.id as string;
  });

  it('POST /tasks – empty title is accepted and defaults to "Nueva tarea"', async () => {
    const res = await request(app.getHttpServer())
      .post('/tasks')
      .set(authHeader(auth.token))
      .send({ title: '' })
      .expect(201);
    expect(res.body.title).toBe('Nueva tarea');
    await request(app.getHttpServer())
      .delete(`/tasks/${res.body.id as string}`)
      .set(authHeader(auth.token));
  });

  // ── List (after create) ───────────────────────────────────────────────────

  it('GET /tasks/me – includes the created task', async () => {
    const res = await request(app.getHttpServer())
      .get('/tasks/me')
      .set(authHeader(auth.token))
      .expect(200);
    const ids = (res.body as Array<{ id: string }>).map((t) => t.id);
    expect(ids).toContain(taskId);
  });

  // ── Get by id ─────────────────────────────────────────────────────────────

  it('GET /tasks/:id – returns the task', async () => {
    const res = await request(app.getHttpServer())
      .get(`/tasks/${taskId}`)
      .set(authHeader(auth.token))
      .expect(200);
    expect(res.body).toMatchObject({ id: taskId, title: 'Write unit tests' });
  });

  it('GET /tasks/:id – 404 for unknown id', () =>
    request(app.getHttpServer())
      .get('/tasks/nonexistent-id-00000')
      .set(authHeader(auth.token))
      .expect(404));

  // ── Update ────────────────────────────────────────────────────────────────

  it('PATCH /tasks/:id – updates title', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/tasks/${taskId}`)
      .set(authHeader(auth.token))
      .send({ title: 'Write integration tests' })
      .expect(200);
    expect(res.body.title).toBe('Write integration tests');
  });

  it('PATCH /tasks/:id – marks task as completed', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/tasks/${taskId}`)
      .set(authHeader(auth.token))
      .send({ completed: true })
      .expect(200);
    expect(res.body.completed).toBe(true);
    expect(res.body.completedAt).not.toBeNull();
  });

  it('PATCH /tasks/:id – 404 for unknown id', () =>
    request(app.getHttpServer())
      .patch('/tasks/nonexistent-id-00000')
      .set(authHeader(auth.token))
      .send({ title: 'x' })
      .expect(404));

  // ── Delete ────────────────────────────────────────────────────────────────

  it('DELETE /tasks/:id – deletes the task', () =>
    request(app.getHttpServer())
      .delete(`/tasks/${taskId}`)
      .set(authHeader(auth.token))
      .expect(204));

  it('GET /tasks/:id – 404 after deletion', () =>
    request(app.getHttpServer())
      .get(`/tasks/${taskId}`)
      .set(authHeader(auth.token))
      .expect(404));

  // ── Breakdown ─────────────────────────────────────────────────────────────

  it('POST /tasks/breakdown – 401 without token', () =>
    request(app.getHttpServer())
      .post('/tasks/breakdown')
      .send({ title: 'Build a login page' })
      .expect(401));

  it('POST /tasks/breakdown – 400 when title is missing', () =>
    request(app.getHttpServer())
      .post('/tasks/breakdown')
      .set(authHeader(auth.token))
      .send({})
      .expect(400));

  it('POST /tasks/breakdown – 400 when title is empty string', () =>
    request(app.getHttpServer())
      .post('/tasks/breakdown')
      .set(authHeader(auth.token))
      .send({ title: '' })
      .expect(400));

  it('POST /tasks/breakdown – 400 when title exceeds 300 characters', () =>
    request(app.getHttpServer())
      .post('/tasks/breakdown')
      .set(authHeader(auth.token))
      .send({ title: 'a'.repeat(301) })
      .expect(400));
});
