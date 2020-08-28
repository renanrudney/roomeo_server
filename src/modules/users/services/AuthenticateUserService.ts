import { injectable, inject } from 'tsyringe';

import signIn from '@shared/utils/sign';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import User from '../infra/typeorm/entities/User';

interface IRequest {
  username: string;
  password: string;
}

interface IResponse {
  user: User;
  authorization: string;
}

@injectable()
export default class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}

  public async execute({ username, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByUsername(username);

    if (!user) {
      throw new AppError('Incorrect username/password!', 401);
    }

    const passwordMatch = await this.hashProvider.compareHash(
      password,
      user.password
    );

    if (!passwordMatch) {
      throw new AppError('Incorrect username/password!', 401);
    }

    const authorization = signIn({ user_id: user.id });

    return {
      user,
      authorization,
    };
  }
}
