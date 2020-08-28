import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';

let fakeHashProvider: FakeHashProvider;
let fakeUsersRepository: FakeUsersRepository;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );
  });

  it('should be able to authenticate', async () => {
    const user = await fakeUsersRepository.create({
      username: 'jhondoe',
      password: '123456',
    });

    const authenticate = await authenticateUser.execute({
      username: 'jhondoe',
      password: '123456',
    });

    expect(authenticate).toHaveProperty('authorization');
    expect(authenticate.user.username).toEqual(user.username);
  });

  it('should not be able to authenticate with non existing username', async () => {
    await expect(
      authenticateUser.execute({
        username: 'non-existing-username',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    await fakeUsersRepository.create({
      username: 'jhondoe',
      password: '123456',
    });

    await expect(
      authenticateUser.execute({
        username: 'jhondoe',
        password: 'wrong-password',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
