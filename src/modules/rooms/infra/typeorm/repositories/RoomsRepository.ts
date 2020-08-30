import { getRepository, Repository } from 'typeorm';

import IRoomsRepository from '@modules/rooms/repositories/IRoomsRepository';
import ICreateRoomDTO from '@modules/rooms/dtos/ICreateRoomDTO';
import Room from '../entities/Room';

export default class RoomsRepository implements IRoomsRepository {
  private ormRepository: Repository<Room>;

  constructor() {
    this.ormRepository = getRepository(Room);
  }

  public async create(data: ICreateRoomDTO): Promise<Room> {
    const room = this.ormRepository.create(data);

    await this.ormRepository.save(room);

    return room;
  }

  public async save(room: Room): Promise<Room> {
    return this.ormRepository.save(room);
  }

  public async findById(id: string): Promise<Room | undefined> {
    return this.ormRepository.findOne(id);
  }
}
