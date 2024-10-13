import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
app.options('*', cors())

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get("/", (res) => {
  return res.send("Hello World");
})

// Use auth routes
app.use('/auth', authRoutes);

// Connect to MongoDB (make sure you have the connection string in your .env file)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
