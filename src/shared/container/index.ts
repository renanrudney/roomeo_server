import { container } from 'tsyringe';

import '@modules/users/providers';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import IRoomsRepository from '@modules/rooms/repositories/IRoomsRepository';
import RoomsRepository from '@modules/rooms/infra/typeorm/repositories/RoomsRepository';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository
);

container.registerSingleton<IRoomsRepository>(
  'RoomsRepository',
  RoomsRepository
);
