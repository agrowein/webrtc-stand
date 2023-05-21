import { io } from 'socket.io-client';

const SERVER_URL = process.env.REACT_APP_WS_URL ?? 'http://localhost:5000';

const socket = io(SERVER_URL);

export default socket;
