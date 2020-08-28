import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';

export default class AuthenticationController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { username, password } = request.body;

    const authenticateUser = container.resolve(AuthenticateUserService);

    const { user, authorization } = await authenticateUser.execute({
      username,
      password,
    });

    return response.json({ user: classToClass(user), authorization });
  }
}
