import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import UpdateUserService from './UpdateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateUser: UpdateUserService;

describe('ShowUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateUser = new UpdateUserService(fakeUsersRepository, fakeHashProvider);
  });

  it('should be able to update a user', async () => {
    const user = await fakeUsersRepository.create({
      username: 'johndoe',
      password: '123456',
    });

    await updateUser.execute({
      username: user.username,
      password: 'new-password',
      mobile_token: 'new-mobile',
    });

    expect(user.password).toBe('new-password');
    expect(user.mobile_token).toBe('new-mobile');
  });

  it('should not be able to update a nonexistent user', async () => {
    await expect(
      updateUser.execute({
        username: 'nonexistent',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
