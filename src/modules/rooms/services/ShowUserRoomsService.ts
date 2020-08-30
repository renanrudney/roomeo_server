import { injectable, inject } from 'tsyringe';
import Room from '../infra/typeorm/entities/Room';
import IRoomsRepository from '../repositories/IRoomsRepository';

interface IRequest {
  username?: string;
}

@injectable()
export default class ShowUserRoomsService {
  constructor(
    @inject('RoomsRepository')
    private roomsRepository: IRoomsRepository
  ) {}

  public async execute({ username }: IRequest): Promise<Room[]> {
    const rooms = await this.roomsRepository.findByParticipant(username);

    return rooms;
  }
}
