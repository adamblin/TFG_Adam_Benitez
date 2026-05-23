import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/infrastructure/prisma/prisma.service';
import { createAuthContext, authHeader, AuthContext } from './e2e-helpers';

describe('ShopController (e2e)', () => {
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

  // ── Auth guards ────────────────────────────────────────────────────────────

  it('GET /shop/catalog – 401 without token', () =>
    request(app.getHttpServer()).get('/shop/catalog').expect(401));

  it('GET /shop/preferences – 401 without token', () =>
    request(app.getHttpServer()).get('/shop/preferences').expect(401));

  it('POST /shop/purchase – 401 without token', () =>
    request(app.getHttpServer())
      .post('/shop/purchase')
      .send({ itemId: 'icon_blue' })
      .expect(401));

  it('POST /shop/equip – 401 without token', () =>
    request(app.getHttpServer())
      .post('/shop/equip')
      .send({ itemId: 'icon_blue' })
      .expect(401));

  // ── Catalog ───────────────────────────────────────────────────────────────

  it('GET /shop/catalog – returns a non-empty array', async () => {
    const res = await request(app.getHttpServer())
      .get('/shop/catalog')
      .set(authHeader(auth.token))
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('GET /shop/catalog – each item has required fields', async () => {
    const res = await request(app.getHttpServer())
      .get('/shop/catalog')
      .set(authHeader(auth.token))
      .expect(200);

    const item = res.body[0];
    expect(item).toHaveProperty('id');
    expect(item).toHaveProperty('type');
    expect(item).toHaveProperty('name');
    expect(item).toHaveProperty('color');
    expect(item).toHaveProperty('rarity');
    expect(item).toHaveProperty('price');
    expect(item).toHaveProperty('owned');
    expect(item).toHaveProperty('equipped');
  });

  it('GET /shop/catalog – free items (price=0) are always owned', async () => {
    const res = await request(app.getHttpServer())
      .get('/shop/catalog')
      .set(authHeader(auth.token))
      .expect(200);

    const freeItems = (
      res.body as Array<{ price: number; owned: boolean }>
    ).filter((i) => i.price === 0);
    expect(freeItems.length).toBeGreaterThan(0);
    freeItems.forEach((i) => expect(i.owned).toBe(true));
  });

  it('GET /shop/catalog – exactly one icon and one theme are equipped', async () => {
    const res = await request(app.getHttpServer())
      .get('/shop/catalog')
      .set(authHeader(auth.token))
      .expect(200);

    const items = res.body as Array<{ type: string; equipped: boolean }>;
    const equippedIcons = items.filter((i) => i.type === 'icon' && i.equipped);
    const equippedThemes = items.filter(
      (i) => i.type === 'theme' && i.equipped,
    );

    expect(equippedIcons).toHaveLength(1);
    expect(equippedThemes).toHaveLength(1);
  });

  // ── Preferences ───────────────────────────────────────────────────────────

  it('GET /shop/preferences – returns default preferences for new user', async () => {
    const res = await request(app.getHttpServer())
      .get('/shop/preferences')
      .set(authHeader(auth.token))
      .expect(200);

    expect(res.body).toHaveProperty('iconColor');
    expect(res.body).toHaveProperty('theme');
  });

  // ── Equip (free items) ────────────────────────────────────────────────────

  it('POST /shop/equip – can equip a free icon item', async () => {
    const res = await request(app.getHttpServer())
      .post('/shop/equip')
      .set(authHeader(auth.token))
      .send({ itemId: 'icon_gray' })
      .expect(200);

    expect(res.body.iconColor).toBe('icon_gray');
  });

  it('POST /shop/equip – can equip a free theme item', async () => {
    const res = await request(app.getHttpServer())
      .post('/shop/equip')
      .set(authHeader(auth.token))
      .send({ itemId: 'theme_dark' })
      .expect(200);

    expect(res.body.theme).toBe('theme_dark');
  });

  it('GET /shop/preferences – reflects the equipped items', async () => {
    const res = await request(app.getHttpServer())
      .get('/shop/preferences')
      .set(authHeader(auth.token))
      .expect(200);

    expect(res.body.iconColor).toBe('icon_gray');
    expect(res.body.theme).toBe('theme_dark');
  });

  // ── Purchase errors ───────────────────────────────────────────────────────

  it('POST /shop/purchase – 404 for non-existent item', () =>
    request(app.getHttpServer())
      .post('/shop/purchase')
      .set(authHeader(auth.token))
      .send({ itemId: 'item_does_not_exist' })
      .expect(404));

  it('POST /shop/purchase – 400 for free item', () =>
    request(app.getHttpServer())
      .post('/shop/purchase')
      .set(authHeader(auth.token))
      .send({ itemId: 'icon_blue' })
      .expect(400));

  it('POST /shop/purchase – fails with insufficient coins', async () => {
    const res = await request(app.getHttpServer())
      .post('/shop/purchase')
      .set(authHeader(auth.token))
      .send({ itemId: 'icon_red' });
    expect(res.status).not.toBe(200);
  });

  // ── Equip errors ──────────────────────────────────────────────────────────

  it('POST /shop/equip – 404 for non-existent item', () =>
    request(app.getHttpServer())
      .post('/shop/equip')
      .set(authHeader(auth.token))
      .send({ itemId: 'item_does_not_exist' })
      .expect(404));

  it('POST /shop/equip – 400 for paid item not owned', () =>
    request(app.getHttpServer())
      .post('/shop/equip')
      .set(authHeader(auth.token))
      .send({ itemId: 'icon_red' })
      .expect(400));
});
