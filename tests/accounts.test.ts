import 'dotenv/config';
import supertest, { Response } from 'supertest';
import mongoose from 'mongoose';
import TestAgent from 'supertest/lib/agent';

import { getRequestListener } from '../src/cli/bootstrap';
import { User } from '../src/interfaces/user';
import { UserModel } from '../src/models';
import { MONGODB_URI } from '../src/settings';
import { generateKey } from '../src/utilities/token';

const EMAIL: string = 'test.user@email.com';
const PASSWORD: string = 'foobarbaz';

const request: TestAgent = supertest(getRequestListener());

describe('Account API Tests', (): void => {
  beforeAll(async (): Promise<void> => {
    await mongoose.connect(MONGODB_URI);
    await UserModel.create({
      email: EMAIL,
      firstName: 'Test',
      lastName: 'User',
      password: PASSWORD,
      isActive: true,
      dateJoined: new Date(),
    });
  });

  afterAll(async (): Promise<void> => {
    await UserModel.deleteOne({ email: EMAIL });
    await mongoose.connection.close();
  });

  describe('POST /api/accounts/login', (): void => {
    it('Performs Account Login', async (): Promise<void> => {
      const payload: { [key: string]: string } = { email: EMAIL, password: PASSWORD };
      const response: Response = await request.post('/api/accounts/login').send(payload);
      expect(response.status).toBe(201);
      expect(response.body.token).toBeDefined();
    });
  });

  describe('GET /api/accounts/detail', (): void => {
    it('Retrieves Account Details', async (): Promise<void> => {
      const user: User | null = await UserModel.findOne({ email: EMAIL });
      if (!user) {
        throw Error('Error: User not found!');
      }
      user.token = { key: generateKey() };
      await user.save();

      const response: Response = await request
        .get('/api/accounts/detail')
        .set('Authorization', `Token ${user.token.key}`);

      expect(response.status).toBe(200);
      expect(response.body.email).toBe(user.email);
      expect(response.body.firstName).toBe(user.firstName);
      expect(response.body.lastName).toBe(user.lastName);
    });

    it('Returns 401 if not authorized', async (): Promise<void> => {
      const response: Response = await request.get('/api/accounts/detail');
      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /api/accounts/logout', (): void => {
    it('Performs Account Logout', async (): Promise<void> => {
      const user: User | null = await UserModel.findOne({ email: EMAIL });
      if (!user) {
        throw Error('Error: User not found!');
      }
      user.token = { key: generateKey() };
      await user.save();

      const response: Response = await request
        .delete('/api/accounts/logout')
        .set('Authorization', `Token ${user.token.key}`);
      expect(response.status).toBe(204);
    });

    it('Returns 401 if not authorized', async (): Promise<void> => {
      const response: Response = await request.delete('/api/accounts/logout');
      expect(response.status).toBe(401);
    });
  });
});
