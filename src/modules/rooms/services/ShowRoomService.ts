import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import Room from '../infra/typeorm/entities/Room';
import IRoomsRepository from '../repositories/IRoomsRepository';

interface IRequest {
  id: string;
}

@injectable()
export default class ShowRoomService {
  constructor(
    @inject('RoomsRepository')
    private roomsRepository: IRoomsRepository
  ) {}

  public async execute({ id }: IRequest): Promise<Room> {
    const room = await this.roomsRepository.findById(id);

    if (!room) {
      throw new AppError('Room not found!');
    }

    return room;
  }
}
