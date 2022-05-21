import EventEmitter from 'events';
import { Socket } from 'socket.io';
import { UserDetail } from '../../authentication/model/User';
import { decodeToken } from '../../../configuration/security/securityUtil';
import logger from '../../../configuration/log/logger';

export declare interface WebsocketClient {
  on(event: 'message', listener: (message: string) => void): this;
  on(event: 'socket-left', listener: () => void): this;
  on(event: 'user-identified', listener: (user: UserDetail) => void): this;
  on(event: 'join-room', listener: (roomId: string) => void): this;
}

export class WebsocketClient extends EventEmitter {
  private user: UserDetail | undefined;
  private socket: Socket;
  private connectedRoom: string | undefined;

  public constructor(socket: Socket) {
    super();
    this.socket = socket;

    this.registerEvents(socket);
  }
  public setUser(user: UserDetail): void {
    this.user = user;
  }
  public getUser(): UserDetail | undefined {
    return this.user;
  }
  public isUserSet(): boolean {
    return this.user !== undefined;
  }
  public setConnectedRoom(room: string): void {
    this.connectedRoom = room;
  }
  public getConnectedRoom(): string | undefined {
    return this.connectedRoom;
  }
  public sendMessage(message: string): void {
    this.socket.emit('message', message);
  }
  public sendError(error: string): void {
    this.socket.emit('error', error);
  }

  private registerEvents(socket: Socket) {
    socket.on('user-identify', async (ticket: string) => {
      let decoded;

      try {
        decoded = (await decodeToken(
          ticket,
          process.env.JWT_WEBSOCKET_SECRET ?? '',
        )) as UserDetail;
      } catch (ex: any) {
        logger.error(ex.message);
        this.sendError(ex.message);
        return;
      }

      logger.info(`User ${decoded.email} identified`);
      this.emit('user-identified', decoded);
    });

    socket.on('message', async (message: string) => {
      if (!this.isUserSet()) {
        this.sendError('User not identified');
        return;
      }

      if (!this.getConnectedRoom()) {
        this.sendError('User not connected to a room');
        return;
      }

      logger.info(`User ${this.getUser()!.email} sent message: ${message}`);
      this.emit('message', message);
    });

    socket.on('disconnect', () => {
      logger.info(`User ${this.getUser()!.email} disconnected`);
      this.emit('socket-left');
    });
  }
}
