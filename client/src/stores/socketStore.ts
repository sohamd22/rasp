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
    try {
      const newSocket = io('https://rasp-deployment-production.up.railway.app', {
        query: { userId },
        autoConnect: false
      });
      newSocket.connect();
      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });
      set({ socket: newSocket });
    } catch (error) {
      console.error('Error connecting socket:', error);
    }
  },
  disconnectSocket: () => {
    set((state) => {
      try {
        if (state.socket) {
          state.socket.disconnect();
        }
        return { socket: null };
      } catch (error) {
        console.error('Error disconnecting socket:', error);
        return state;
      }
    });
  },
}));

export default useSocketStore;
