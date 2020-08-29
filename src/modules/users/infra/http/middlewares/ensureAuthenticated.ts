import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '@config/auth';

import AppError from '@shared/errors/AppError';

export default function ensureAuthenticated(
  request: Request,
  _response: Response,
  next: NextFunction
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('Missing authorization!', 401);
  }

  const [, authorization] = authHeader.split(' ');

  try {
    verify(authorization, authConfig.jwt.secret);

    return next();
  } catch {
    throw new AppError('Invalid authorization!', 401);
  }
}
