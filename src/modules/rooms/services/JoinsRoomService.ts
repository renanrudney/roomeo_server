import { injectable, inject } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';
import IRoomsRepository from '../repositories/IRoomsRepository';
import Room from '../infra/typeorm/entities/Room';

interface IRequest {
  username: string;
  guid: string;
}

@injectable()
export default class JoinsRoomService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('RoomsRepository')
    private roomsRepository: IRoomsRepository
  ) {}

  public async execute({ username, guid }: IRequest): Promise<Room> {
    const user = await this.usersRepository.findByUsername(username);

    if (!user) {
      throw new AppError('User not found!');
    }

    const room = await this.roomsRepository.findById(guid);

    if (!room) {
      throw new AppError('Room not found!');
    }

    const userInRoom = room.participants.find(
      participant => participant.username === username
    );

    if (userInRoom) {
      throw new AppError('User already a participant!');
    } else {
      room.participants.push(user);

      return this.roomsRepository.save(room);
    }
  }
}
