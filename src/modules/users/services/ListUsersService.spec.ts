import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ListUsersService from './ListUsersService';

let fakeUsersRepository: FakeUsersRepository;
let listUsers: ListUsersService;

describe('ListUsers', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    listUsers = new ListUsersService(fakeUsersRepository);
  });

  it('should be able to list all users', async () => {
    await fakeUsersRepository.create({
      username: 'jhondoe',
      password: '123456',
    });

    await fakeUsersRepository.create({
      username: 'doejhon',
      password: '123456',
    });

    const users = await listUsers.execute();
    expect(users).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ username: 'jhondoe' }),
        expect.objectContaining({ username: 'doejhon' }),
      ])
    );
  });
});
