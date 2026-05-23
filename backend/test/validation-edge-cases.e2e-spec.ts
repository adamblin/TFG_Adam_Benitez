import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/infrastructure/prisma/prisma.service';
import { createAuthContext, authHeader, AuthContext } from './e2e-helpers';

describe('Validation edge cases (e2e)', () => {
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

  // ── Task validation ───────────────────────────────────────────────────────

  it('POST /tasks – rejects title longer than 120 chars (400)', () =>
    request(app.getHttpServer())
      .post('/tasks')
      .set(authHeader(auth.token))
      .send({ title: 'A'.repeat(121) })
      .expect(400));

  it('POST /tasks – accepts title of exactly 120 chars (201)', () =>
    request(app.getHttpServer())
      .post('/tasks')
      .set(authHeader(auth.token))
      .send({ title: 'A'.repeat(120) })
      .expect(201));

  it('POST /tasks – rejects invalid dueDate string (400)', () =>
    request(app.getHttpServer())
      .post('/tasks')
      .set(authHeader(auth.token))
      .send({ title: 'Task', dueDate: 'not-a-date' })
      .expect(400));

  it('POST /tasks – accepts valid ISO dueDate (201)', () =>
    request(app.getHttpServer())
      .post('/tasks')
      .set(authHeader(auth.token))
      .send({ title: 'Task with date', dueDate: '2099-06-15' })
      .expect(201));

  it('POST /tasks – rejects missing title field (400)', () =>
    request(app.getHttpServer())
      .post('/tasks')
      .set(authHeader(auth.token))
      .send({})
      .expect(400));

  // ── Subtask validation ────────────────────────────────────────────────────

  it('POST /subtasks – rejects missing taskId (400)', () =>
    request(app.getHttpServer())
      .post('/subtasks')
      .set(authHeader(auth.token))
      .send({ title: 'Subtask without taskId' })
      .expect(400));

  it('POST /subtasks – rejects missing title (400)', async () => {
    const taskRes = await request(app.getHttpServer())
      .post('/tasks')
      .set(authHeader(auth.token))
      .send({ title: 'Parent' })
      .expect(201);

    await request(app.getHttpServer())
      .post('/subtasks')
      .set(authHeader(auth.token))
      .send({ taskId: (taskRes.body as { id: string }).id })
      .expect(400);
  });

  // ── Focus session validation ───────────────────────────────────────────────

  it('POST /focus/start – rejects durationMin = 0 (400)', () =>
    request(app.getHttpServer())
      .post('/focus/start')
      .set(authHeader(auth.token))
      .send({ durationMin: 0 })
      .expect(400));

  it('POST /focus/start – rejects durationMin > 180 (400)', () =>
    request(app.getHttpServer())
      .post('/focus/start')
      .set(authHeader(auth.token))
      .send({ durationMin: 181 })
      .expect(400));

  it('POST /focus/start – rejects durationMin as string (400)', () =>
    request(app.getHttpServer())
      .post('/focus/start')
      .set(authHeader(auth.token))
      .send({ durationMin: 'twenty-five' })
      .expect(400));

  it('POST /focus/start – rejects missing durationMin (400)', () =>
    request(app.getHttpServer())
      .post('/focus/start')
      .set(authHeader(auth.token))
      .send({})
      .expect(400));

  it('POST /focus/start – accepts durationMin = 1 (201)', () =>
    request(app.getHttpServer())
      .post('/focus/start')
      .set(authHeader(auth.token))
      .send({ durationMin: 1 })
      .expect(201));

  it('POST /focus/start – accepts durationMin = 180 (201)', () =>
    request(app.getHttpServer())
      .post('/focus/start')
      .set(authHeader(auth.token))
      .send({ durationMin: 180 })
      .expect(201));

  // ── Auth validation ───────────────────────────────────────────────────────

  it('POST /auth/register – rejects invalid email (400)', () =>
    request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'not-an-email', username: 'user', password: 'pass123' })
      .expect(400));

  it('POST /auth/register – rejects password shorter than 6 chars (400)', () =>
    request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'valid@example.com',
        username: 'validuser',
        password: '123',
      })
      .expect(400));
});
