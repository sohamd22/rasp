import express from 'express';
import { googleAuth, googleAuthCallback, logout, getUser } from '../controllers/authController.js';
import { isAuthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/google', googleAuth);
router.get('/google/callback', googleAuthCallback);
router.get('/logout', isAuthenticated, logout);
router.get('/user', isAuthenticated, getUser);

export default router;

