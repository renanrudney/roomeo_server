import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import CreateUserService from '@modules/users/services/CreateUserService';
import ListUsersService from '@modules/users/services/ListUsersService';
import signIn from '@shared/utils/sign';
import ShowUserService from '@modules/users/services/ShowUserService';

export default class UsersController {
  public async index(_request: Request, response: Response): Promise<Response> {
    const listUsers = container.resolve(ListUsersService);

    const users = await listUsers.execute();

    return response.json(classToClass(users));
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { username, password, mobile_token } = request.body;

    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute({
      username,
      password,
      mobile_token,
    });

    const authorization = signIn({ user_id: user.id });

    return response.json({ ...classToClass(user), authorization });
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { username } = request.params;
    const showUser = container.resolve(ShowUserService);

    const user = await showUser.execute({ username });

    return response.json(classToClass(user));
  }
}
