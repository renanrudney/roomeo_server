import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import User from '../infra/typeorm/entities/User';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
  username: string;
  password?: string;
  mobile_token?: string;
}

@injectable()
export default class UpdateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}

  public async execute({
    username,
    password,
    mobile_token,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findByUsername(username);

    if (!user) {
      throw new AppError('User not found!');
    }

    if (mobile_token) {
      user.mobile_token = mobile_token;
    }

    if (password) {
      user.password = await this.hashProvider.generateHash(password);
    }

    return this.usersRepository.save(user);
  }
}
