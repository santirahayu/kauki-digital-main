import express from 'express';
import { login, getMe, changePassword, updateProfile } from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.get('/me', verifyToken, getMe);
router.post('/change-password', verifyToken, changePassword);
router.put('/profile', verifyToken, updateProfile);

export default router;
