import { STATUS_CODES } from 'http';

import { Response, Request, NextFunction } from 'express';

import { User } from '@/interfaces/user';
import { UserModel } from '@/models';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

/**
 * Authentication middleware.
 * @param {Request} request
 * @param {Response} response
 * @param {NextFunction} next
 * @return {Promise<Response | void>}
 */
export default async function authenticate(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<Response | void> {
  const authorization: string | undefined = request.headers?.authorization;
  if (!authorization) {
    return response.status(401).json({ detail: STATUS_CODES[401] });
  }
  const values: string[] = authorization.split(' ');
  if (values.length !== 2) {
    return response.status(401).json({ detail: STATUS_CODES[401] });
  }
  if ('Token'.toLowerCase() !== values[0].toLowerCase()) {
    return response.status(401).json({ detail: STATUS_CODES[401] });
  }
  const user: User | null = await UserModel.findOne({
    'token.key': values[1],
  });
  if (!user) {
    return response.status(403).json({ detail: STATUS_CODES[403] });
  }
  request.user = user;
  return next();
}
