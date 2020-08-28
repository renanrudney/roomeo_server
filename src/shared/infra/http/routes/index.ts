import { Router } from 'express';

import usersRouter from '@modules/users/infra/http/routes/users.routes';
import authRouter from '@modules/users/infra/http/routes/authentication.routes';

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/authenticate', authRouter);

export default routes;
