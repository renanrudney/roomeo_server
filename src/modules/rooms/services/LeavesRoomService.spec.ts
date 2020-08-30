import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeRoomsRepository from '../repositories/fakes/FakeRoomsRepository';
import LeavesRoomService from './LeavesRoomService';

let fakeRoomsRepository: FakeRoomsRepository;
let fakeUsersRepository: FakeUsersRepository;
let leaveRoom: LeavesRoomService;

describe('LeavesRoom', () => {
  beforeEach(() => {
    fakeRoomsRepository = new FakeRoomsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    leaveRoom = new LeavesRoomService(fakeUsersRepository, fakeRoomsRepository);
  });

  it('should be able to leaves a room', async () => {
    const host = await fakeUsersRepository.create({
      username: 'johndoe',
      password: '123456',
    });

    const userJoined = await fakeUsersRepository.create({
      username: 'johndoe-join',
      password: '123456',
    });

    const createdRoom = await fakeRoomsRepository.create({
      host,
      name: 'room',
      participants: [host],
    });

    createdRoom.participants.push(userJoined);

    const room = await leaveRoom.execute({
      username: userJoined.username,
      guid: createdRoom.id,
    });

    expect(room).toBeUndefined();
  });

  it('should not be able to leaves a room with an nonexisting user', async () => {
    await expect(
      leaveRoom.execute({
        username: 'non-user',
        guid: '123456',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to leaves a room with an nonexisting room', async () => {
    const user = await fakeUsersRepository.create({
      username: 'johndoe-join',
      password: '123456',
    });

    await expect(
      leaveRoom.execute({
        username: user.username,
        guid: '123456',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to leave a room is not a participant', async () => {
    const host = await fakeUsersRepository.create({
      username: 'johndoe',
      password: '123456',
    });

    const userJoined = await fakeUsersRepository.create({
      username: 'johndoe-join',
      password: '123456',
    });

    const createdRoom = await fakeRoomsRepository.create({
      host,
      name: 'room',
      participants: [host],
    });

    await expect(
      leaveRoom.execute({
        username: userJoined.username,
        guid: createdRoom.id,
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
