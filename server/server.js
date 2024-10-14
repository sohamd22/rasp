import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from 'url';
import { createServer } from "http";
import { Server } from "socket.io";

import { withAuth } from './middleware/authMiddleware.js';
import apiRouter from './api.js';
import { setConnectedClient, removeConnectedClient, emitToConnectedClient } from './utils/connectedClients.js';

import dotenv from "dotenv";
dotenv.config();

// Connect to MongoDB (make sure you have the connection string in your .env file)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Setup Express App
const app = express();
const server = createServer(app);

app.use(cors({
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
}));
app.use(express.json());
app.use(cookieParser());

// Use api routes
app.use('/api', apiRouter);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files, but not for the root path
app.use((req, res, next) => {
  if (req.path !== '/') {
    return express.static(path.join(__dirname, '../client/dist'))(req, res, next);
  }
  next();
});

// Root route handler
app.get('/', withAuth, (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});

// Catch-all route for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});

// Setup Socket.io
const io = new Server(server);

io.on('connection', (socket) => {
  const { userId } = socket.handshake.query;

  console.log(`User ${userId} connected.`);
  setConnectedClient(userId, socket);

  socket.on('disconnect', () => {
    console.log(`User ${userId} disconnected.`);
    removeConnectedClient(userId);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
