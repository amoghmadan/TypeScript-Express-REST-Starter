import 'dotenv/config';
import mongoose from 'mongoose';
import supertest, { Response } from 'supertest';
import TestAgent from 'supertest/lib/agent';

import { getRequestListener } from '../src/cli/bootstrap';
import { User } from '../src/interfaces/user';
import { UserModel } from '../src/models';
import { MONGODB_URI } from '../src/settings';
import { generateKey } from '../src/utilities/token';

const ROOT_URL: string = '/api/accounts';
const KEYWORD: string = 'Token';
const EMAIL: string = 'test.user@email.com';
const CREDENTIALS: Record<string, string> = {
  email: EMAIL,
  password: 'foobarbaz',
};

const request: TestAgent = supertest(getRequestListener());

describe('Account API Tests', (): void => {
  beforeAll(async (): Promise<void> => {
    await mongoose.connect(MONGODB_URI);
    await UserModel.create({
      ...CREDENTIALS,
      firstName: 'Test',
      lastName: 'User',
    });
  });

  afterAll(async (): Promise<void> => {
    await UserModel.deleteOne({ email: EMAIL });
    await mongoose.connection.close();
  });

  describe(`POST ${ROOT_URL}/login`, (): void => {
    it('Performs Account Login', async (): Promise<void> => {
      const response: Response = await request
        .post(`${ROOT_URL}/login`)
        .send(CREDENTIALS);
      expect(response.status).toBe(201);
      expect(response.body.token).toBeDefined();
    });
  });

  describe(`GET ${ROOT_URL}/detail`, (): void => {
    it('Retrieves Account Details', async (): Promise<void> => {
      const user: User | null = await UserModel.findOne({ email: EMAIL });
      if (!user) {
        throw Error('Error: User not found!');
      }
      user.token = { key: generateKey() };
      await user.save();

      const response: Response = await request
        .get(`${ROOT_URL}/detail`)
        .set('Authorization', `${KEYWORD} ${user.token.key}`);

      expect(response.status).toBe(200);
      expect(response.body.email).toBe(user.email);
      expect(response.body.firstName).toBe(user.firstName);
      expect(response.body.lastName).toBe(user.lastName);
    });

    it('Returns 401 if not authorized', async (): Promise<void> => {
      const response: Response = await request.get(`${ROOT_URL}/detail`);
      expect(response.status).toBe(401);
    });
  });

  describe(`DELETE ${ROOT_URL}/logout`, (): void => {
    it('Performs Account Logout', async (): Promise<void> => {
      const user: User | null = await UserModel.findOne({ email: EMAIL });
      if (!user) {
        throw Error('Error: User not found!');
      }
      user.token = { key: generateKey() };
      await user.save();

      const response: Response = await request
        .delete(`${ROOT_URL}/logout`)
        .set('Authorization', `${KEYWORD} ${user.token.key}`);
      expect(response.status).toBe(204);
    });

    it('Returns 401 if not authorized', async (): Promise<void> => {
      const response: Response = await request.delete(`${ROOT_URL}/logout`);
      expect(response.status).toBe(401);
    });
  });
});
