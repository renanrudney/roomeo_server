import User from '../infra/typeorm/entities/User';
import ICreateUserDTO from '../dtos/ICreateUserDTO';

export default interface IUsersRepository {
  create(data: ICreateUserDTO): Promise<User>;
  delete(user: User): Promise<void>;
  findAllUsers(): Promise<User[]>;
  findByUsername(username: string): Promise<User | undefined>;
  save(user: User): Promise<User>;
}
