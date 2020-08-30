import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import RoomsController from '../controllers/RoomsController';
import SwitchRoomsController from '../controllers/SwitchRoomsController';

const roomsRouter = Router();
const roomsController = new RoomsController();
const switchController = new SwitchRoomsController();

roomsRouter.get('/:guid', roomsController.show);
roomsRouter.post(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      name: Joi.string(),
      capacity: Joi.number(),
    },
  }),
  roomsController.store
);

roomsRouter.post('/:guid/join', ensureAuthenticated, switchController.create);
roomsRouter.post('/:guid/leave', ensureAuthenticated, switchController.destroy);

export default roomsRouter;
