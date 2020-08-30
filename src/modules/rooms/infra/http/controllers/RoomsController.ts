import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateRoomService from '@modules/rooms/services/CreateRoomService';
import { classToClass } from 'class-transformer';
import ShowRoomService from '@modules/rooms/services/ShowRoomService';

export default class RoomsController {
  public async store(request: Request, response: Response): Promise<Response> {
    const { username } = request.user;
    const { name, capacity } = request.body;
    const createRoom = container.resolve(CreateRoomService);

    const room = await createRoom.execute({ username, name, capacity });

    return response.json(classToClass(room));
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { guid } = request.params;
    const showRoom = container.resolve(ShowRoomService);

    const room = await showRoom.execute({ id: guid });

    return response.json(classToClass(room));
  }
}
