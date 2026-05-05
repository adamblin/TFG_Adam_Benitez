import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/infrastructure/prisma/prisma.service';
import { createPrismaServiceMock } from './e2e-prisma.mock';

type RegisterResponse = {
  id: string;
  email: string;
  username: string;
};

type LoginResponse = {
  token: string;
  refreshToken: string;
};

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  const uniqueSuffix = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  const email = `test_${uniqueSuffix}@example.com`;
  const username = `test_${uniqueSuffix}`.slice(0, 20);
  const password = 'password123';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(createPrismaServiceMock())
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('registers, logs in, refreshes tokens and returns the authenticated user', async () => {
    const registerResponse = (await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email, username, password })
      .expect(201)) as unknown as { body: RegisterResponse };

    expect(registerResponse.body).toMatchObject({
      email,
      username,
    });
    expect(registerResponse.body.id).toEqual(expect.any(String));

    const loginResponse = (await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username, password })
      .expect(201)) as unknown as { body: LoginResponse };

    expect(loginResponse.body.token).toEqual(expect.any(String));
    expect(loginResponse.body.refreshToken).toEqual(expect.any(String));

    const refreshResponse = (await request(app.getHttpServer())
      .post('/auth/refresh')
      .send({ refreshToken: loginResponse.body.refreshToken })
      .expect(201)) as unknown as { body: LoginResponse };

    expect(refreshResponse.body.token).toEqual(expect.any(String));
    expect(refreshResponse.body.refreshToken).toEqual(expect.any(String));

    const meResponse = await request(app.getHttpServer())
      .get('/users/me')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .expect(200);

    expect(meResponse.body).toEqual({
      id: registerResponse.body.id,
      username,
    });
  });
});
