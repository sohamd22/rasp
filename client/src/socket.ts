import { io } from 'socket.io-client';

const URL = import.meta.env.PROD ? undefined : `${import.meta.env.VITE_SERVER_URL}`;

export const socket = io(URL, { autoConnect: false });
