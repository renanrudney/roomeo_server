import User from '@modules/users/infra/typeorm/entities/User';

export default interface ICreateRoomDTO {
  host: User;
  name: string;
  capacity?: number;
  participants: User[];
}
