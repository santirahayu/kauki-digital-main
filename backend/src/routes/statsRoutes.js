import express from 'express';
import { getDashboardStats } from '../controllers/statsController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, getDashboardStats);

export default router;
