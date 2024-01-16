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
const EMAIL: string = 'account.testuser@email.com';
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
      firstName: 'Account',
      lastName: 'Test User',
    });
  });

  afterAll(async (): Promise<void> => {
    await UserModel.deleteOne({ email: EMAIL });
    await mongoose.connection.close();
  });

  describe(`POST ${ROOT_URL}/login`, (): void => {
    it('Incomplete Payload', async (): Promise<void> => {
      const response: Response = await request
        .post(`${ROOT_URL}/login`)
        .send({ email: EMAIL });
      expect(response.status).toBe(400);
    });
  });

  describe(`POST ${ROOT_URL}/login`, (): void => {
    it('Invalid Credentials', async (): Promise<void> => {
      const response: Response = await request
        .post(`${ROOT_URL}/login`)
        .send({ email: EMAIL, password: 'foobarba' });
      expect(response.status).toBe(401);
    });
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

    it('Returns 401 if Bearer instead of Token', async (): Promise<void> => {
      const response: Response = await request
        .get(`${ROOT_URL}/detail`)
        .set('Authorization', 'Bearer Token');
      expect(response.status).toBe(401);
    });

    it('Returns 401 if more than two value', async (): Promise<void> => {
      const response: Response = await request
        .get(`${ROOT_URL}/detail`)
        .set('Authorization', 'This Bearer Token');
      expect(response.status).toBe(401);
    });

    it('Returns 403 if invalid token', async (): Promise<void> => {
      const response: Response = await request
        .get(`${ROOT_URL}/detail`)
        .set('Authorization', 'Token 0X1X2X3X4X5X6X7X8X');
      expect(response.status).toBe(403);
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
  });
});
