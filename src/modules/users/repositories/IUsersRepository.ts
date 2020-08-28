import User from '../infra/typeorm/entities/User';
import ICreateUserDTO from '../dtos/ICreateUserDTO';

export default interface IUsersRepository {
  create(data: ICreateUserDTO): Promise<User>;
  findAllUsers(): Promise<User[]>;
  findByUsername(username: string): Promise<User | undefined>;
}
