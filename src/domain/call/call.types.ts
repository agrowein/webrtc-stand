import {Socket} from 'socket.io';

export type SocketWithUser = Socket & {
	user: {
		login: string;
	}
}