import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import UsersController from '../controllers/UsersController';
// import authentication from '../middlewares/ensureAuthenticated';

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
  usersController.create
);

export default usersRouter;
