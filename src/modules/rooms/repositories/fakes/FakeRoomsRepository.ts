import Room from '@modules/rooms/infra/typeorm/entities/Room';
import ICreateRoomDTO from '@modules/rooms/dtos/ICreateRoomDTO';
import IRoomsRepository from '../IRoomsRepository';

export default class FakeRoomsRepository implements IRoomsRepository {
  private rooms: Room[] = [];

  public async create(data: ICreateRoomDTO): Promise<Room> {
    const room = new Room();

    Object.assign(room, { ...data, participants: [] });

    this.rooms.push(room);

    return room;
  }

  public async findById(id: string): Promise<Room | undefined> {
    const findRoom = this.rooms.find(room => room.id === id);

    return findRoom;
  }

  public async save(room: Room): Promise<Room> {
    this.rooms.push(room);

    return room;
  }
}
