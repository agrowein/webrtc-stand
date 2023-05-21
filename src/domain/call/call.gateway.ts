import {
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { OnGatewayConnection } from '@nestjs/websockets/interfaces/hooks/on-gateway-connection.interface';
import {Server, Socket} from 'socket.io';
import { UserService } from '../user/user.service';
import { CallService } from './call.service';
import { UseGuards } from '@nestjs/common';
import { WsGuard } from '../../guards/ws.guard';
import { SocketWithUser } from './call.types';
import {JwtService} from '@nestjs/jwt';

// @UseGuards(WsGuard)
@WebSocketGateway({ transport: 'websocket', cors: {
    origin: '*', // Здесь можно указать разрешенный источник (например, 'http://example.com')
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Здесь можно указать разрешенные методы
    allowedHeaders: ['*'], // Здесь можно указать разрешенные заголовки
    credentials: true, // Разрешить отправку куки
  }
})
export class CallGateway {
  constructor(
    private userService: UserService,
    private callService: CallService,
    private jwtService: JwtService,
  ) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('newUser')
  handleNewUser(client: Socket, data: any) {
    // Обработка нового пользователя
    console.log('New user connected:', client.id);

    // Отправка приветственного сообщения новому пользователю
    client.emit('message', 'Welcome to the chat!');

    // Отправка оповещения о новом пользователе другим пользователям
    client.broadcast.emit('join', client.id);
  }

  @SubscribeMessage('offer')
  handleOffer(client: Socket, { to, offer }: { to: string, offer: RTCSessionDescriptionInit }) {
    // Обработка получения оффера от пользователя
    console.log('Received offer from user:', client.id);

    // Логика обработки оффера
    // ...

    // Отправка оффера другому пользователю
    this.server.to(to).emit('offer', offer);
  }

  @SubscribeMessage('answer')
  handleAnswer(client: Socket, { to, answer }: { to: string, answer: RTCSessionDescriptionInit }) {
    // Обработка получения ответа от пользователя
    console.log('Received answer from user:', client.id);

    // Логика обработки ответа
    // ...

    // Отправка ответа другому пользователю
    this.server.to(to).emit('answer', answer);
  }

  @SubscribeMessage('candidate')
  handleCandidate(client: Socket, { to, candidate }: { to: string, candidate: RTCIceCandidateInit}) {
    // Обработка получения кандидата от пользователя
    console.log('Received candidate from user:', client.id);

    // Логика обработки кандидата
    // ...

    // Отправка кандидата другому пользователю
    this.server.to(to).emit('candidate', candidate);
  }

}
