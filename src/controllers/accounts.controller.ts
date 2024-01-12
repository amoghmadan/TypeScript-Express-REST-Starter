import { Request, Response } from 'express';
import { ValidationError } from 'joi';

import { accountsService } from '../services';
import { Detail } from '../interfaces/user';

export default {
  login: async (request: Request, response: Response): Promise<Response> => {
    try {
      const data: { token: string } | null = await accountsService.login(request.body);
      if (!data) {
        return response.status(401).json({ detail: 'Invalid credentials!' });
      }
      return response.status(201).json(data);
    } catch (err: unknown) {
      if (err instanceof ValidationError && err.name === 'ValidationError') {
        return response.status(401).json({ detail: 'Invalid credentials!' });
      }
      return response.status(500).json(err);
    }
  },
  detail: async (request: Request, response: Response): Promise<Response> => {
    const data: Detail = await accountsService.detail(request.user!);
    return response.status(200).json(data);
  },
  logout: async (request: Request, response: Response): Promise<Response> => {
    try {
      await accountsService.logout(request.user!);
      return response.status(204).json(null);
    } catch (err) {
      return response.status(500).json(err);
    }
  },
};
