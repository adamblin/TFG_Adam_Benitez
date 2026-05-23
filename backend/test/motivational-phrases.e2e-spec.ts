import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/infrastructure/prisma/prisma.service';
import { createAuthContext, authHeader, AuthContext } from './e2e-helpers';

describe('MotivationalPhrasesController (e2e)', () => {
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
    await prisma.user.deleteMany({ where: { id: auth.userId } });
    await app.close();
  });

  // ── Auth guard ────────────────────────────────────────────────────────────

  it('GET /motivational-phrases/random – 401 without token', () =>
    request(app.getHttpServer())
      .get('/motivational-phrases/random?category=TASK')
      .expect(401));

  // ── Categories ────────────────────────────────────────────────────────────

  const categories = ['TASK', 'SUBTASK', 'FOCUS'] as const;

  categories.forEach((category) => {
    it(`GET /motivational-phrases/random?category=${category} – returns a phrase or null`, async () => {
      const res = await request(app.getHttpServer())
        .get(`/motivational-phrases/random?category=${category}`)
        .set(authHeader(auth.token))
        .expect(200);

      if (res.body !== null) {
        expect(typeof res.body.text).toBe('string');
        expect(res.body.text.length).toBeGreaterThan(0);
      }
    });
  });
});
