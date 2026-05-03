import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  const uniqueSuffix = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  const email = `user_${uniqueSuffix}@example.com`;
  const username = `user_${uniqueSuffix}`.slice(0, 20);
  const password = 'password123';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('registers a new user and rejects duplicates', async () => {
    // Register via auth to create a user, then fetch profile via /users/me
    const registerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email, username, password })
      .expect(201);

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username, password })
      .expect(201);

    const meResponse = await request(app.getHttpServer())
      .get('/users/me')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .expect(200);

    expect(meResponse.body).toEqual({ id: registerResponse.body.id, username });
  });
});