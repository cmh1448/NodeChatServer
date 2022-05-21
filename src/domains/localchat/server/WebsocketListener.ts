import dayjs, { Dayjs } from 'dayjs';
import { Server } from 'socket.io';
import logger from '../../../configuration/log/logger';
import { UserDetail, UserSummary } from '../../authentication/model/User';
import { Room } from '../model/Room';
import { WebsocketClient } from './WebsocketClient';

export class WebsocketListener {
  private server: Server;
  private clients: WebsocketClient[] = [];

  public constructor(app: any) {
    this.server = new Server(app);

    this.server.on('connection', (socket: any) => {
      const client = new WebsocketClient(socket);
      this.clients.push(client);
      logger.info(`Client connected: ${socket.id}`);
      this.registerEvents(client);
    });
  }

  private sendMessageToRoom(
    roomId: string,
    message: string,
    sendby?: WebsocketClient,
  ) {
    const messageContent = {
      source: sendby?.getUser() as UserSummary,
      timestamp: dayjs().toISOString(),
      message,
    };

    this.server.to(roomId).emit('message', JSON.stringify(messageContent));
  }

  private registerEvents(client: WebsocketClient) {
    //when a client sends a message
    client.on('message', (message: string) => {
      const roomId = client.getConnectedRoom();
      if (roomId) {
        this.sendMessageToRoom(roomId, message, client);
      }
    });

    //when a client leaves
    client.on('socket-left', () => {
      logger.info(`Client disconnected: ${client.getUser()?.email}`);
    });

    //when user is identified
    client.on('user-identified', (user: UserDetail) => {
      const existingClient = this.clients.find(
        (c) => c.getUser()?.email === user.email,
      );
      if (existingClient) {
        logger.info(`User ${user.email} already connected`);
        existingClient.sendError(`User ${user.email} already connected`);
        return;
      }

      client.setUser(user);
      logger.info(`User ${user.email} identified`);
    });

    // when a client joins a room
    client.on('join-room', async (roomId: string) => {
      const foundRoom = await Room.findById(roomId).populate('users').exec();
      if (!foundRoom) {
        logger.info(`Room ${roomId} not found`);
        client.sendError(`Room ${roomId} not found`);
        return;
      }

      //check if user is in the room
      const userInRoom = foundRoom.users.find(
        (u) => u.email === client.getUser()?.email,
      );
      if (!userInRoom) {
        logger.info(`User ${client.getUser()?.email} not in room ${roomId}`);
        client.sendError(
          `User ${client.getUser()?.email} not in room ${roomId}`,
        );
        return;
      }

      client.setConnectedRoom(foundRoom._id.toString());
      logger.info(`User ${client.getUser()?.email} joined room ${roomId}`);
    });
  }
}
