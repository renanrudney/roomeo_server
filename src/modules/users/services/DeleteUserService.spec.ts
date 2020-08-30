import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import DeleteUserService from './DeleteUserService';

let fakeUsersRepository: FakeUsersRepository;
let deleteUser: DeleteUserService;

describe('DeleteUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    deleteUser = new DeleteUserService(fakeUsersRepository);
  });

  it('should be able to delete a user', async () => {
    const user = await fakeUsersRepository.create({
      username: 'johndoe',
      password: '123456',
    });

    await deleteUser.execute({
      username: 'johndoe',
    });

    const findUser = await fakeUsersRepository.findByUsername(user.username);

    expect(findUser).toBeUndefined();
  });

  it('should not be able to delete a inexistent user', async () => {
    await expect(
      deleteUser.execute({
        username: 'nonexistent',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
