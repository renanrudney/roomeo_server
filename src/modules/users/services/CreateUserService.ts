import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import User from '../infra/typeorm/entities/User';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
  username: string;
  password: string;
  mobile_token?: string;
}

@injectable()
export default class CreateUserService {
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
    const checkUsernameExists = await this.usersRepository.findByUsername(
      username
    );

    if (checkUsernameExists) {
      throw new AppError('Username already used!');
    }

    const hashedPassword = await this.hashProvider.generateHash(password);

    const user = await this.usersRepository.create({
      username,
      password: hashedPassword,
      mobile_token,
    });

    return user;
  }
}
