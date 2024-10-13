import { io } from 'socket.io-client';

const URL = import.meta.env.PROD ? undefined : `/`;

export const socket = io(URL, { autoConnect: false });
