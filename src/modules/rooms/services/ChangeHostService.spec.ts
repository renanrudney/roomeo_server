import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeRoomsRepository from '../repositories/fakes/FakeRoomsRepository';
import ChangeHostService from './ChangeHostService';

let fakeUsersRepository: FakeUsersRepository;
let fakeRoomsRepository: FakeRoomsRepository;
let changeHost: ChangeHostService;

describe('ChangeHost', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeRoomsRepository = new FakeRoomsRepository();
    changeHost = new ChangeHostService(
      fakeUsersRepository,
      fakeRoomsRepository
    );
  });

  it('should be able to change host', async () => {
    const host = await fakeUsersRepository.create({
      username: 'johndoe-host',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      username: 'johndoe',
      password: '123456',
    });

    const room = await fakeRoomsRepository.create({
      host,
      name: 'johndoe room',
      participants: [host],
    });

    const hostRoom = await changeHost.execute({
      guid: room.id,
      host_username: host.username,
      username: user.username,
    });

    expect(hostRoom.host.username).toBe(user.username);
  });

  it('should not be able to change host with an nonexisting host', async () => {
    await expect(
      changeHost.execute({
        host_username: 'inexistent',
        username: 'existent',
        guid: 'existent',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to change host with an nonexisting room', async () => {
    const host = await fakeUsersRepository.create({
      username: 'johndoe-host',
      password: '123456',
    });

    await expect(
      changeHost.execute({
        host_username: host.username,
        username: 'inexistent',
        guid: 'existent',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to change host with an non-host user', async () => {
    const host = await fakeUsersRepository.create({
      username: 'johndoe-host',
      password: '123456',
    });

    const room = await fakeRoomsRepository.create({
      host,
      name: 'johndoe room',
      participants: [host],
    });

    const user = await fakeUsersRepository.create({
      username: 'johndoe',
      password: '123456',
    });

    await expect(
      changeHost.execute({
        host_username: user.username,
        username: 'existent',
        guid: room.id,
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to change host with an nonexistent user', async () => {
    const host = await fakeUsersRepository.create({
      username: 'johndoe-host',
      password: '123456',
    });

    const room = await fakeRoomsRepository.create({
      host,
      name: 'johndoe room',
      participants: [host],
    });

    await expect(
      changeHost.execute({
        host_username: host.username,
        username: 'inexistent',
        guid: room.id,
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to change host already hosts', async () => {
    const host = await fakeUsersRepository.create({
      username: 'johndoe-host',
      password: '123456',
    });

    const room = await fakeRoomsRepository.create({
      host,
      name: 'johndoe room',
      participants: [host],
    });

    await expect(
      changeHost.execute({
        host_username: host.username,
        username: host.username,
        guid: room.id,
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to change host to a participant', async () => {
    const host = await fakeUsersRepository.create({
      username: 'johndoe-host',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      username: 'johndoe',
      password: '123456',
    });

    const room = await fakeRoomsRepository.create({
      host,
      name: 'johndoe room',
      participants: [user],
    });

    room.participants.push(user);
    await fakeRoomsRepository.save(room);

    const hostRoom = await changeHost.execute({
      guid: room.id,
      host_username: host.username,
      username: user.username,
    });

    expect(hostRoom.host.username).toBe(user.username);
  });
});
