import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import CreateUserService from '@modules/users/services/CreateUserService';
import ListUsersService from '@modules/users/services/ListUsersService';
import signIn from '@shared/utils/sign';
import ShowUserService from '@modules/users/services/ShowUserService';
import UpdateUserService from '@modules/users/services/UpdateUserService';
import DeleteUserService from '@modules/users/services/DeleteUserService';

export default class UsersController {
  public async index(_request: Request, response: Response): Promise<Response> {
    const listUsers = container.resolve(ListUsersService);

    const users = await listUsers.execute();

    return response.json(classToClass(users));
  }

  public async store(request: Request, response: Response): Promise<Response> {
    const { username, password, mobile_token } = request.body;

    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute({
      username,
      password,
      mobile_token,
    });

    const authorization = signIn({ username: user.username });

    return response.json({ ...classToClass(user), authorization });
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { username } = request.params;
    const showUser = container.resolve(ShowUserService);

    const user = await showUser.execute({ username });

    return response.json(classToClass(user));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { username } = request.user;
    const { password, mobile_token } = request.body;

    const updateUser = container.resolve(UpdateUserService);

    const user = await updateUser.execute({ username, password, mobile_token });

    return response.json(classToClass(user));
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { username } = request.user;

    const deleteUser = container.resolve(DeleteUserService);

    await deleteUser.execute({ username });

    return response.status(204).send();
  }
}
