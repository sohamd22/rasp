const connectedClients = new Map();

const setConnectedClient = (userId, socket) => {
  connectedClients.set(userId, socket);
};

const removeConnectedClient = (userId) => {
  connectedClients.delete(userId);
};

const emitToConnectedClient = (userId, eventName, data) => {
  const socket = connectedClients.get(userId.toString());
  if (socket) {
    socket.emit(eventName, data);
  }
};

export { 
  setConnectedClient, 
  removeConnectedClient, 
  emitToConnectedClient
};