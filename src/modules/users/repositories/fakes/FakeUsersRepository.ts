import { v4 } from 'uuid';

import User from '@modules/users/infra/typeorm/entities/User';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IUsersRepository from '../IUsersRepository';

export default class UsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(
      user,
      {
        id: v4(),
      },
      userData
    );
    this.users.push(user);

    return user;
  }

  public async findByUsername(username: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.username === username);

    return findUser;
  }

  public async findAllUsers(): Promise<User[]> {
    const { users } = this;
    return users;
  }
}
