import express from 'express';
import authRoutes from './routes/authRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);

export default router;