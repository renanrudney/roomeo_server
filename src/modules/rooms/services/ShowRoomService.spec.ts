import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ShowRoomService from './ShowRoomService';
import FakeRoomsRepository from '../repositories/fakes/FakeRoomsRepository';

let showRoom: ShowRoomService;
let fakeRoomsRepository: FakeRoomsRepository;
let fakeUsersRepository: FakeUsersRepository;

describe('ShowRoom', () => {
  beforeEach(() => {
    fakeRoomsRepository = new FakeRoomsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    showRoom = new ShowRoomService(fakeRoomsRepository);
  });

  it('should be able to show a room', async () => {
    const host = await fakeUsersRepository.create({
      username: 'johndoe',
      password: '123456',
    });

    const createdRoom = await fakeRoomsRepository.create({
      host,
      name: 'room',
      participants: [host],
    });

    const room = await showRoom.execute({ id: createdRoom.id });

    expect(room.id).toEqual(createdRoom.id);
  });

  it('should not be able to show an nonexistent room', async () => {
    await expect(
      showRoom.execute({ id: 'inexistent-room' })
    ).rejects.toBeInstanceOf(AppError);
  });
});
