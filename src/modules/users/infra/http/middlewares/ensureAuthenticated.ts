import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '@config/auth';

import AppError from '@shared/errors/AppError';

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

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
    const verified = verify(authorization, authConfig.jwt.secret);

    const { sub } = verified as ITokenPayload;

    request.user = {
      username: sub,
    };

    return next();
  } catch {
    throw new AppError('Invalid authorization!', 401);
  }
}
