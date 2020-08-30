import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeRoomsRepository from '../repositories/fakes/FakeRoomsRepository';
import JoinsRoomService from './JoinsRoomService';

let fakeRoomsRepository: FakeRoomsRepository;
let fakeUsersRepository: FakeUsersRepository;
let joinRoom: JoinsRoomService;

describe('JoinsRoom', () => {
  beforeEach(() => {
    fakeRoomsRepository = new FakeRoomsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    joinRoom = new JoinsRoomService(fakeUsersRepository, fakeRoomsRepository);
  });

  it('should be able to join a room', async () => {
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

    const room = await joinRoom.execute({
      username: userJoined.username,
      guid: createdRoom.id,
    });

    expect(room.participants).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ username: userJoined.username }),
      ])
    );
  });

  it('should not be able to join a room with an nonexisting user', async () => {
    await expect(
      joinRoom.execute({
        username: 'non-user',
        guid: '123456',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to join a room with an nonexisting room', async () => {
    const user = await fakeUsersRepository.create({
      username: 'johndoe-join',
      password: '123456',
    });

    await expect(
      joinRoom.execute({
        username: user.username,
        guid: '123456',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to join a full room', async () => {
    const host = await fakeUsersRepository.create({
      username: 'johndoe',
      password: '123456',
    });

    const userJoin = await fakeUsersRepository.create({
      username: 'johndoe-join',
      password: '123456',
    });

    const createdRoom = await fakeRoomsRepository.create({
      host,
      name: 'room',
      participants: [host],
      capacity: 1,
    });

    await expect(
      joinRoom.execute({
        username: userJoin.username,
        guid: createdRoom.id,
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to join a room already participant', async () => {
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

    await joinRoom.execute({
      username: userJoined.username,
      guid: createdRoom.id,
    });

    await expect(
      joinRoom.execute({
        username: userJoined.username,
        guid: createdRoom.id,
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
