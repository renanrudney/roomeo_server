import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeRoomsRepository from '../repositories/fakes/FakeRoomsRepository';
import ShowUserRoomsService from './ShowUserRoomsService';

let fakeRoomsRepository: FakeRoomsRepository;
let fakeUsersRepository: FakeUsersRepository;
let showUserRooms: ShowUserRoomsService;

describe('ShowUserRooms', () => {
  beforeEach(() => {
    fakeRoomsRepository = new FakeRoomsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    showUserRooms = new ShowUserRoomsService(fakeRoomsRepository);
  });

  it('should be able to show a list of rooms that the user is in', async () => {
    const host = await fakeUsersRepository.create({
      username: 'johndoe',
      password: '123456',
    });

    await fakeRoomsRepository.create({
      host,
      name: 'room',
      participants: [host],
    });

    const rooms = await showUserRooms.execute({ username: host.username });

    expect(rooms).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          participants: expect.arrayContaining([
            expect.objectContaining({ username: host.username }),
          ]),
        }),
      ])
    );
  });
});
