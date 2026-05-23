import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/infrastructure/prisma/prisma.service';
import { createAuthContext, authHeader, AuthContext } from './e2e-helpers';

describe('Streaks & XP (e2e)', () => {
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

  // ── Auth guards ───────────────────────────────────────────────────────────

  it('GET /streaks – 401 without token', () =>
    request(app.getHttpServer()).get('/streaks').expect(401));

  it('GET /xp/me – 401 without token', () =>
    request(app.getHttpServer()).get('/xp/me').expect(401));

  // ── Streaks ───────────────────────────────────────────────────────────────

  it('GET /streaks – returns streak data (defaults to 0 for new user)', async () => {
    const res = await request(app.getHttpServer())
      .get('/streaks')
      .set(authHeader(auth.token))
      .expect(200);

    expect(res.body).toMatchObject({
      currentStreak: expect.any(Number),
      longestStreak: expect.any(Number),
    });
    expect(res.body.currentStreak).toBeGreaterThanOrEqual(0);
    expect(res.body.longestStreak).toBeGreaterThanOrEqual(0);
  });

  it('GET /streaks – longestStreak >= currentStreak', async () => {
    const res = await request(app.getHttpServer())
      .get('/streaks')
      .set(authHeader(auth.token))
      .expect(200);
    expect(res.body.longestStreak).toBeGreaterThanOrEqual(
      res.body.currentStreak,
    );
  });

  // ── XP ────────────────────────────────────────────────────────────────────

  it('GET /xp/me – returns level info for new user', async () => {
    const res = await request(app.getHttpServer())
      .get('/xp/me')
      .set(authHeader(auth.token))
      .expect(200);

    expect(res.body).toMatchObject({
      totalXp: expect.any(Number),
      level: expect.any(Number),
      xpInLevel: expect.any(Number),
      xpToNextLevel: expect.any(Number),
      progressPercent: expect.any(Number),
      coins: expect.any(Number),
    });
  });

  it('GET /xp/me – progressPercent is between 0 and 100', async () => {
    const res = await request(app.getHttpServer())
      .get('/xp/me')
      .set(authHeader(auth.token))
      .expect(200);
    expect(res.body.progressPercent).toBeGreaterThanOrEqual(0);
    expect(res.body.progressPercent).toBeLessThanOrEqual(100);
  });

  it('GET /xp/me – level is at least 1', async () => {
    const res = await request(app.getHttpServer())
      .get('/xp/me')
      .set(authHeader(auth.token))
      .expect(200);
    expect(res.body.level).toBeGreaterThanOrEqual(1);
  });
});
