import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowUserService from './ShowUserService';

let showUser: ShowUserService;
let fakeUsersRepository: FakeUsersRepository;

describe('ShowUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showUser = new ShowUserService(fakeUsersRepository);
  });

  it('should be able to show a user', async () => {
    const { username } = await fakeUsersRepository.create({
      username: 'johndoe',
      password: '123456',
    });

    const existentUser = await showUser.execute({ username });

    expect(existentUser.username).toEqual(username);
  });

  it('should not be able to show an nonexistent user', async () => {
    await expect(
      showUser.execute({ username: 'inexistent-user' })
    ).rejects.toBeInstanceOf(AppError);
  });
});
