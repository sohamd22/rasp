import { create } from 'zustand';
import io, { Socket } from 'socket.io-client';

interface SocketState {
  socket: Socket | null;
  connectSocket: (userId: string) => void;
  disconnectSocket: () => void;
}

const useSocketStore = create<SocketState>((set) => ({
  socket: null,
  connectSocket: (userId: string) => {
    const newSocket = io(`${import.meta.env.VITE_SERVER_URL}`, {
      query: { userId },
      autoConnect: false
    });
    newSocket.connect();
    set({ socket: newSocket });
  },
  disconnectSocket: () => {
    set((state) => {
      state.socket?.disconnect();
      return { socket: null };
    });
  },
}));

export default useSocketStore;