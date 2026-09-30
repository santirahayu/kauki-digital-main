import express from 'express';
import { getPortfolio, createPortfolio, updatePortfolio, deletePortfolio } from '../controllers/portfolioController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getPortfolio);
router.post('/', verifyToken, createPortfolio);
router.put('/:id', verifyToken, updatePortfolio);
router.delete('/:id', verifyToken, deletePortfolio);

export default router;
