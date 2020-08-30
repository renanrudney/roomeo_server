import { injectable, inject } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';
import Room from '../infra/typeorm/entities/Room';
import IRoomsRepository from '../repositories/IRoomsRepository';

interface IRequest {
  guid: string;
  host_username: string;
  username: string;
}

@injectable()
export default class ChangeHostService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('RoomsRepository')
    private roomsRepository: IRoomsRepository
  ) {}

  public async execute({
    guid,
    host_username,
    username,
  }: IRequest): Promise<Room> {
    const host = await this.usersRepository.findByUsername(host_username);

    if (!host) {
      throw new AppError('Host user not found!');
    }

    const room = await this.roomsRepository.findById(guid);

    if (!room) {
      throw new AppError('Room not found!');
    }

    if (room.host.username !== host.username) {
      throw new AppError('User is not a host!');
    }

    const user = await this.usersRepository.findByUsername(username);

    if (!user) {
      throw new AppError('User not found!');
    }

    if (room.host.username === user.username) {
      throw new AppError('User already a host!');
    }

    const userIndex = room.participants.findIndex(
      participant => participant.username === user.username
    );

    if (userIndex > -1) {
      room.participants.splice(userIndex, 1);
    }

    room.host = user;
    room.participants.push(host);

    return this.roomsRepository.save(room);
  }
}
