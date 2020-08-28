import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import AuthenticationController from '../controllers/AuthenticationController';

const authRouter = Router();
const authController = new AuthenticationController();

authRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      username: Joi.string().required(),
      password: Joi.string().required(),
    },
  }),
  authController.create
);

export default authRouter;
