import { Router } from 'express';

import usersRouter from '@modules/users/infra/http/routes/users.routes';
import authRouter from '@modules/users/infra/http/routes/authentication.routes';
import roomsRouter from '@modules/rooms/infra/http/routes/rooms.routes';

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/authenticate', authRouter);
routes.use('/rooms', roomsRouter);

export default routes;
