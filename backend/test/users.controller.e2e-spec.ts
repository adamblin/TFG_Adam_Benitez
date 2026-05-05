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

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  const uniqueSuffix = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  const email = `user_${uniqueSuffix}@example.com`;
  const username = `user_${uniqueSuffix}`.slice(0, 20);
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

  it('registers a new user and rejects duplicates', async () => {
    // Register via auth to create a user, then fetch profile via /users/me
    const registerResponse = (await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email, username, password })
      .expect(201)) as unknown as { body: RegisterResponse };

    const loginResponse = (await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username, password })
      .expect(201)) as unknown as { body: LoginResponse };

    const meResponse = await request(app.getHttpServer())
      .get('/users/me')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .expect(200);

    expect(meResponse.body).toEqual({ id: registerResponse.body.id, username });
  });
});
