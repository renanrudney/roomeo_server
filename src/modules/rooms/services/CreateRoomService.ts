import { inject, injectable } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';
import Room from '../infra/typeorm/entities/Room';
import IRoomsRepository from '../repositories/IRoomsRepository';

interface IRequest {
  username: string;
  name: string;
  capacity?: number;
}

@injectable()
export default class CreateRoomService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('RoomsRepository')
    private roomsRepository: IRoomsRepository
  ) {}

  public async execute({ username, name, capacity }: IRequest): Promise<Room> {
    const host = await this.usersRepository.findByUsername(username);

    if (!host) {
      throw new AppError('User not found!');
    }

    const room = await this.roomsRepository.create({
      host,
      name,
      capacity: capacity || 5,
      participants: [host],
    });

    return room;
  }
}
