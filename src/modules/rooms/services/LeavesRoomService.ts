import { injectable, inject } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';
import IRoomsRepository from '../repositories/IRoomsRepository';

interface IRequest {
  username: string;
  guid: string;
}

@injectable()
export default class LeavesRoomService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('RoomsRepository')
    private roomsRepository: IRoomsRepository
  ) {}

  public async execute({ username, guid }: IRequest): Promise<void> {
    const user = await this.usersRepository.findByUsername(username);

    if (!user) {
      throw new AppError('User not found!');
    }

    const room = await this.roomsRepository.findById(guid);

    if (!room) {
      throw new AppError('Room not found!');
    }

    const userIndex = room.participants.findIndex(
      participant => participant.username === username
    );

    if (userIndex > -1) {
      room.participants.splice(userIndex, 1);
    } else {
      throw new AppError('User is not a participant!');
    }
    await this.roomsRepository.save(room);
  }
}
