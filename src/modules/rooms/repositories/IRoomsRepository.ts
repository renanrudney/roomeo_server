import ICreateRoomDTO from '../dtos/ICreateRoomDTO';
import Room from '../infra/typeorm/entities/Room';

export default interface IRoomsRepository {
  create(data: ICreateRoomDTO): Promise<Room>;
  findById(id: string): Promise<Room | undefined>;
  save(room: Room): Promise<Room>;
}
