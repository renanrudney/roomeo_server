import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeRoomsRepository from '../repositories/fakes/FakeRoomsRepository';
import CreateRoomService from './CreateRoomService';

let fakeUsersRepository: FakeUsersRepository;
let fakeRoomsRepository: FakeRoomsRepository;
let createRoom: CreateRoomService;

describe('CreateRoom', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeRoomsRepository = new FakeRoomsRepository();
    createRoom = new CreateRoomService(
      fakeUsersRepository,
      fakeRoomsRepository
    );
  });

  it('should be able to create a new room', async () => {
    const user = await fakeUsersRepository.create({
      username: 'johndoe',
      password: '123456',
    });

    const room = await createRoom.execute({
      username: user.username,
      name: 'johndoe room',
      capacity: 10,
    });

    expect(room.name).toBe('johndoe room');
    expect(room).toHaveProperty('host.id');
  });

  it('should not be able to create a room with an nonexisting user', async () => {
    await expect(
      createRoom.execute({
        username: 'non-user',
        name: 'room',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
