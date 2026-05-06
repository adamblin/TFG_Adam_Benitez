import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/infrastructure/prisma/prisma.service';

interface TaskTestData {
  id?: string;
  title?: string;
  done?: boolean;
  error?: string;
}

describe('TasksController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let testTaskId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    prisma = moduleFixture.get<PrismaService>(PrismaService);

    await prisma.task.deleteMany({});
    const task = await prisma.task.create({
      data: { title: 'Test Task 1', done: false },
    });
    testTaskId = task.id;
  }, 30000);

  afterAll(async () => {
    await prisma.task.deleteMany({});
    await app.close();
  });

  describe('GET /tasks', () => {
    it('should return all tasks', () => {
      return request(app.getHttpServer())
        .get('/tasks')
        .expect(200)
        .expect((res: { body: TaskTestData[] }) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
          if (res.body[0]) {
            expect(res.body[0]).toHaveProperty('id');
            expect(res.body[0]).toHaveProperty('title');
            expect(res.body[0]).toHaveProperty('done');
          }
        });
    });
  });

  describe('GET /tasks/:id', () => {
    it('should return a single task', () => {
      return request(app.getHttpServer())
        .get(`/tasks/${testTaskId}`)
        .expect(200)
        .expect((res: { body: TaskTestData }) => {
          expect(res.body).toHaveProperty('id', testTaskId);
          expect(res.body).toHaveProperty('title');
          expect(res.body).toHaveProperty('done');
        });
    });

    it('should return error for non-existent task', () => {
      return request(app.getHttpServer())
        .get('/tasks/nonexistent-id-999')
        .expect(200)
        .expect((res: { body: TaskTestData }) => {
          expect(res.body).toHaveProperty('error');
        });
    });
  });

  describe('POST /tasks', () => {
    it('should create a new task', () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .send({ title: 'Nueva tarea de prueba' })
        .expect(201)
        .expect((res: { body: TaskTestData }) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('title', 'Nueva tarea de prueba');
          expect(res.body).toHaveProperty('done', false);
        });
    });
  });

  describe('PUT /tasks/:id', () => {
    it('should update a task', () => {
      return request(app.getHttpServer())
        .put(`/tasks/${testTaskId}`)
        .send({ done: true })
        .expect(200)
        .expect((res: { body: TaskTestData }) => {
          expect(res.body).toHaveProperty('id', testTaskId);
          expect(res.body).toHaveProperty('done', true);
        });
    });

    it('should return error for non-existent task', () => {
      return request(app.getHttpServer())
        .put('/tasks/nonexistent-id-999')
        .send({ done: true })
        .expect(200)
        .expect((res: { body: TaskTestData }) => {
          expect(res.body).toHaveProperty('error');
        });
    });
  });
});
