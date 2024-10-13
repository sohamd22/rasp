import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import path from "path";
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
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
}));
app.use(express.json());
app.use(cookieParser());

// Use auth routes
app.use('/auth', authRoutes);

// Serve static files, but not for the root path
app.use((req, res, next) => {
  if (req.path !== '/') {
    return express.static(path.join(__dirname, '/client/dist'))(req, res, next);
  }
  next();
});

const __dirname = path.resolve();
// Root route handler
app.get('/', withAuth, (req, res) => {
  res.sendFile(path.join(__dirname, '/client/dist', 'index.html'));
});

// Catch-all route for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/dist', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
