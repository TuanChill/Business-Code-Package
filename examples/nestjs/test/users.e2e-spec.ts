import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { BusinessCode } from '@tchil/business-codes';

describe('Users (e2e)', () => {
  let app: INestApplication;

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

  describe('GET /users/:id', () => {
    it('returns wrapped user on success', async () => {
      const res = await request(app.getHttpServer()).get('/users/1');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe('1');
      expect(res.body.message).toBe('Success');
    });

    it('returns 404 with USER_NOT_FOUND code for missing user', async () => {
      const res = await request(app.getHttpServer()).get('/users/999');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe(BusinessCode.USER_NOT_FOUND);
    });
  });

  describe('GET /users', () => {
    it('returns paginated envelope', async () => {
      const res = await request(app.getHttpServer()).get('/users');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.meta).toBeDefined();
      expect(typeof res.body.meta.total).toBe('number');
      expect(typeof res.body.meta.totalPages).toBe('number');
      expect(typeof res.body.meta.hasNextPage).toBe('boolean');
    });
  });

  describe('POST /users', () => {
    it('creates a user and returns 201 wrapped', async () => {
      const res = await request(app.getHttpServer())
        .post('/users')
        .send({ email: 'charlie@example.com', name: 'Charlie' });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe('charlie@example.com');
      expect(res.body.statusCode).toBe(201);
    });

    it('returns 409 with EMAIL_ALREADY_EXISTS for duplicate email', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .send({ email: 'duplicate@example.com', name: 'Dup' });
      const res = await request(app.getHttpServer())
        .post('/users')
        .send({ email: 'duplicate@example.com', name: 'Dup2' });
      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe(BusinessCode.EMAIL_ALREADY_EXISTS);
    });
  });

  describe('GET /users/raw/:id', () => {
    it('returns raw object without ApiResponse envelope', async () => {
      const res = await request(app.getHttpServer()).get('/users/raw/1');
      expect(res.status).toBe(200);
      expect(res.body.success).toBeUndefined();
      expect(res.body.id).toBe('1');
    });
  });

  describe('GET /users/boom', () => {
    it('returns 422 with VALIDATION_ERROR and details', async () => {
      const res = await request(app.getHttpServer()).get('/users/boom');
      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe(BusinessCode.VALIDATION_ERROR);
      expect(res.body.error.details).toBeDefined();
      expect(res.body.error.details.email).toBe('Invalid email');
    });
  });
});
