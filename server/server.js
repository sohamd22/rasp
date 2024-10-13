import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import path from "path";
import http from "http";
import authRoutes from './routes/authRoutes.js';
import { withAuth } from './middleware/authMiddleware.js';
import { getUser } from './controllers/authController.js';

import dotenv from "dotenv";
dotenv.config();

// Connect to MongoDB (make sure you have the connection string in your .env file)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Setup Express App
const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
}));
app.use(express.json());
app.use(cookieParser());

// Use auth routes
app.use('/auth', authRoutes);

// Setup static file serving
const httpServer = http.createServer(app);
const __dirname = path.resolve();
  
const serveStatic = express.static(path.join(__dirname, '../client/dist'));
app.use(serveStatic);

app.get('/', withAuth, getUser);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
