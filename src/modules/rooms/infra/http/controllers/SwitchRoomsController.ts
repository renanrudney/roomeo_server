import { Request, Response } from 'express';
import { container } from 'tsyringe';

import LeavesRoomService from '@modules/rooms/services/LeavesRoomService';
import JoinsRoomService from '@modules/rooms/services/JoinsRoomService';
import { classToClass } from 'class-transformer';

export default class SwitchRoomsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { username } = request.user;
    const { guid } = request.params;
    const joinsRoom = container.resolve(JoinsRoomService);

    const room = await joinsRoom.execute({ username, guid });

    return response.json(classToClass(room));
  }

  public async destroy(
    request: Request,
    response: Response
  ): Promise<Response> {
    const { username } = request.user;
    const { guid } = request.params;
    const leavesRoom = container.resolve(LeavesRoomService);

    await leavesRoom.execute({ username, guid });

    return response.status(204).send();
  }
}
