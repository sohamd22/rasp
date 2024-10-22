import Chat from '../models/chatModel.js';
import Message from '../models/messageModel.js';
import { User } from '../models/userModel.js';
import { emitToConnectedClient, publish } from '../utils/connectedClients.js';

const messageCooldowns = new Map();
const MESSAGE_COOLDOWN_DURATION = 1000; // 1 second

const checkMessageCooldown = (userId) => {
  const now = Date.now();
  const lastMessageTime = messageCooldowns.get(userId) || 0;
  if (now - lastMessageTime < MESSAGE_COOLDOWN_DURATION) {
    const remainingCooldown = MESSAGE_COOLDOWN_DURATION - (now - lastMessageTime);
    return { onCooldown: true, remainingCooldown };
  }
  messageCooldowns.set(userId, now);
  return { onCooldown: false };
};

const getChats = async (req, res) => {
  const chatDocuments = await Chat.find({ 
    users: { $all: [req.params.userId] },
    'messages.0': { $exists: true }  // This ensures at least one message exists
  });
  const chats = [];
  for (const chat of chatDocuments) {
    const otherUser = await User.findById(chat.users.find(userId => userId != req.params.userId));
    chats.push({
      _id: chat._id,
      users: chat.users,
      groupName: chat.groupName,
      isGroupChat: chat.isGroupChat,
      pendingApprovals: chat.pendingApprovals,
      lastMessage: chat.lastMessage,
      otherUserName: otherUser?.name
    });
  }
  
  // Sort chats, handling null lastMessage
  chats.sort((a, b) => {
    if (!a.lastMessage) return 1;  // Move chats without lastMessage to the end
    if (!b.lastMessage) return -1; // Move chats without lastMessage to the end
    return b.lastMessage.timestamp - a.lastMessage.timestamp;
  });
  
  res.json(chats);
}

const getMessages = async (req, res) => {
  const chatId = req.params.chatId;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;

  const chat = await Chat.findById(chatId);
  if (!chat) {
    return res.status(404).json({ message: 'Chat not found' });
  }

  const skip = (page - 1) * limit;
  const messages = await Message.find({ _id: { $in: chat.messages } })
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(limit);

  res.json(messages.reverse());
}

const saveMessage = async (req, res) => {
  const senderId = req.body.senderId;
  const { onCooldown, remainingCooldown } = checkMessageCooldown(senderId);
  
  if (onCooldown) {
    return res.status(429).json({ 
      error: 'Please wait before sending another message.',
      remainingCooldown
    });
  }

  const chat = await Chat.findById(req.params.chatId);
  if (!chat) {
    return res.status(404).json({ message: 'Chat not found' });
  }

  const sender = await User.findById(req.body.senderId);
  if (!sender) {
    return res.status(404).json({ message: 'Sender not found' });
  }

  // Check if the message content is empty or only whitespace
  if (!req.body.message || req.body.message.trim() === '') {
    return res.status(400).json({ message: 'Message content cannot be empty' });
  }

  const newMessage = await Message.create({
    sender: req.body.senderId,
    senderName: sender.name,
    chat: req.params.chatId,
    content: req.body.message.trim(),
    timestamp: Date.now()
  });

  chat.messages.push(newMessage._id);
  chat.lastMessage = {
    messageId: newMessage._id,
    content: newMessage.content,
    timestamp: newMessage.timestamp,
    senderName: sender.name,
    senderId: sender._id
  };

  await chat.save();
  
  chat.users.forEach(userId => {
    if (userId.toString() !== req.body.senderId) {
      chat.unreadMessages.set(userId.toString(), true);
    }
  });
  await chat.save();
  
  res.status(201).json(newMessage);
}


const createChat = async (req, res) => {
  const { users, name, isGroupChat } = req.body;

  const unreadMessages = users.reduce((acc, userId) => {
    acc[userId.toString()] = false;
    return acc;
  }, {});

  // Check if a non-group chat already exists between these users
  if (!isGroupChat) {
    const existingChat = await Chat.findOne({
      users: { $all: users, $size: 2 },
      isGroupChat: false
    });

    if (existingChat) {
      return res.status(200).json(existingChat);
    }
  }

  const chat = await Chat.create({
    users,
    groupName: name,
    admin: users[0],
    messages: [],
    isGroupChat,
    pendingApprovals: isGroupChat ? users.slice(1) : [],
    unreadMessages
  });

  res.status(201).json(chat);
}

const updateGroupChat = async (req, res) => {
  const { chatId, name, users, admin } = req.body;

  const chat = await Chat.findById(chatId);

  if (!chat) {
    return res.status(404).json({ message: 'Chat not found' });
  }

  if (chat.admin.toString() !== admin) {
    return res.status(403).json({ message: 'Only admin can update the chat' });
  }

  if (name) {
    chat.name = name;
  }

  if (users && users.length > 0) {
    chat.pendingApprovals = [...chat.pendingApprovals, ...users];
  }

  await chat.save();

  res.status(200).json(chat);
}


const approveGroupChatRequest = async (req, res) => {
  const { chatId, userId } = req.body;

  const chat = await Chat.findById(chatId);

  if (!chat) {
    return res.status(404).json({ message: 'Chat not found' });
  }

  if (!chat.pendingApprovals.includes(userId)) {
    return res.status(400).json({ message: 'No pending approval for this user' });
  }

  chat.pendingApprovals = chat.pendingApprovals.filter(id => id.toString() !== userId);
  chat.users.push(userId);

  await chat.save();

  res.status(200).json(chat);
}

const messageChangeStream = Message.watch();
messageChangeStream.on('change', async (change) => {
  if(change.operationType !== 'insert') return;

  const message = await Message.findById(change.fullDocument._id);
  const chat = await Chat.findById(message.chat).populate('users', 'name');

  const lastMessage = {
    messageId: message._id,
    content: message.content,
    timestamp: message.timestamp,
    senderName: chat.users.find(user => user._id.toString() === message.sender.toString()).name,
    senderId: message.sender,
  };

  chat.lastMessage = lastMessage;
  await chat.save();
  
  const changedChat = {
    _id: chat._id,
    users: chat.users.map(user => user._id),
    groupName: chat.groupName,
    isGroupChat: chat.isGroupChat,
    pendingApprovals: chat.pendingApprovals,
    lastMessage: lastMessage,
    otherUserName: chat.isGroupChat ? chat.groupName : chat.users.find(user => user._id.toString() !== message.sender.toString()).name
  };


  chat.users.forEach(user => {
    emitToConnectedClient(user._id.toString(), 'message', message);
    emitToConnectedClient(user._id.toString(), 'chat', changedChat);
  });
});

const markChatAsRead = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    chat.unreadMessages.set(req.body.userId, false);
    await chat.save();

    res.status(200).json({ message: 'Chat marked as read' });
  } catch (error) {
    console.error('Error marking chat as read:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export { getMessages, saveMessage, getChats, createChat, updateGroupChat, approveGroupChatRequest, markChatAsRead };