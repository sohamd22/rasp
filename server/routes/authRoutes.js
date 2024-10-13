import express from 'express';
import { login, callback, logout, checkAuth, getUser } from '../controllers/authController.js';
import { withAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/login', login);
router.get('/callback', callback);
router.get('/logout', logout);
router.get('/check', withAuth, checkAuth);
router.get('/user', withAuth, getUser);

export default router;