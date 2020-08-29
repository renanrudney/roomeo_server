import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  username: string;
}

@injectable()
export default class DeleteUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  public async execute({ username }: IRequest): Promise<void> {
    const findUser = await this.usersRepository.findByUsername(username);

    if (!findUser) {
      throw new AppError('User not found!');
    }

    await this.usersRepository.delete(findUser);
  }
}
