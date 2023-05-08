import {
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { OnGatewayConnection } from '@nestjs/websockets/interfaces/hooks/on-gateway-connection.interface';
import { Server } from 'socket.io';
import { UserService } from '../user/user.service';
import { CallService } from './call.service';
import { UseGuards } from '@nestjs/common';
import { WsGuard } from '../../guards/ws.guard';
import { SocketWithUser } from './call.types';
import {JwtService} from '@nestjs/jwt';

@UseGuards(WsGuard)
@WebSocketGateway()
export class CallGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  constructor(
    private userService: UserService,
    private callService: CallService,
    private jwtService: JwtService,
  ) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('request')
  handleRequest(client: SocketWithUser, payload: any) {
    
  }

  @SubscribeMessage('call')
  handleCall(client: SocketWithUser, payload: any) {

  }

  @SubscribeMessage('end')
  handleEnd(client: SocketWithUser, payload: any) {

  }

  afterInit(server: Server) {

  }

  async handleConnection(client: SocketWithUser) {
    try {
      const authorization = client.handshake.headers.authorization;
      const token = authorization.split(' ')[1] ?? '';
      const payload = await this.jwtService.verifyAsync(token);

      client.user = { login: payload.login };
      const clientFromServer = this.server.sockets.sockets.get(client.id);
      this.server.sockets.sockets.delete(client.id);
      this.server.sockets.sockets.set(payload.login, clientFromServer);
    } catch (e) {
      client.emit('error', 'Unauthorized');
      client.disconnect();
    }
  }

  handleDisconnect(client: SocketWithUser) {

  }

}
