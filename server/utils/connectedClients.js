const connectedClients = new Map();
const subscribers = new Map();

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

const subscribe = (channel, callback) => {
  if (!subscribers.has(channel)) {
    subscribers.set(channel, new Set());
  }
  subscribers.get(channel).add(callback);
};

const publish = (channel, data) => {
  const channelSubscribers = subscribers.get(channel);
  if (channelSubscribers) {
    channelSubscribers.forEach(callback => callback(data));
  }
};

export { 
  setConnectedClient, 
  removeConnectedClient, 
  emitToConnectedClient,
  subscribe,
  publish
};