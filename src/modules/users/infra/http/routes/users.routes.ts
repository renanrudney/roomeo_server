import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import UsersController from '../controllers/UsersController';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const usersRouter = Router();
const usersController = new UsersController();

usersRouter.get('/', usersController.index);
usersRouter.get('/:username', usersController.show);
usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      username: Joi.string().required(),
      password: Joi.string().required(),
      mobile_token: Joi.string(),
    },
  }),
  usersController.store
);
usersRouter.put('/', ensureAuthenticated, usersController.update);
usersRouter.delete('/', ensureAuthenticated, usersController.delete);

export default usersRouter;
