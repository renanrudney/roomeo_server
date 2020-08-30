import Room from '@modules/rooms/infra/typeorm/entities/Room';
import ICreateRoomDTO from '@modules/rooms/dtos/ICreateRoomDTO';
import IRoomsRepository from '../IRoomsRepository';

export default class FakeRoomsRepository implements IRoomsRepository {
  private rooms: Room[] = [];

  public async create(data: ICreateRoomDTO): Promise<Room> {
    const room = new Room();

    Object.assign(room, data);

    this.rooms.push(room);

    return room;
  }

  public async findById(id: string): Promise<Room | undefined> {
    const findRoom = this.rooms.find(room => room.id === id);

    return findRoom;
  }

  public async findByParticipant(
    participant: string | undefined
  ): Promise<Room[]> {
    const rooms = this.rooms.filter(room =>
      room.participants.filter(user => user.username === participant)
    );

    return rooms;
  }

  public async save(room: Room): Promise<Room> {
    this.rooms.push(room);

    return room;
  }
}
