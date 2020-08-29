import { Repository, getRepository } from 'typeorm';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import User from '../entities/User';

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = this.ormRepository.create(userData);
    await this.ormRepository.save(user);

    return user;
  }

  public async findByUsername(username: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({ where: { username } });

    return user;
  }

  public async findAllUsers(): Promise<User[]> {
    const users = await this.ormRepository.find();

    return users;
  }

  public async save(user: User): Promise<User> {
    const saveUser = await this.ormRepository.save(user);

    return saveUser;
  }

  public async delete(user: User): Promise<void> {
    await this.ormRepository.delete(user.id);
  }
}

export default UsersRepository;
