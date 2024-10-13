import express from 'express';
import { login, callback, getUser, logout } from '../controllers/authController.js';
import { withAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/login', login);
router.get('/callback', callback);
router.get('/user', withAuth, getUser);
router.get('/logout', logout);

export default router;

