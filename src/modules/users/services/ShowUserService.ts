import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import User from '../infra/typeorm/entities/User';

interface IRequest {
  username: string;
}

@injectable()
export default class ShowUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  public async execute({ username }: IRequest): Promise<User> {
    const user = await this.usersRepository.findByUsername(username);

    if (!user) {
      throw new AppError('User not found!');
    }

    return user;
  }
}
