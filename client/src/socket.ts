import { io } from 'socket.io-client';

const URL = import.meta.env.PROD ? undefined : 'http://localhost:4000';

export const socket = io(URL, { autoConnect: false });
