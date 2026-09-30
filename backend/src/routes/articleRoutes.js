import { Router } from 'express';
import {
  getAllArticles,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle,
  incrementViews
} from '../controllers/articleController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = Router();

// Public routes
router.get('/', getAllArticles);
router.get('/:slug', getArticleBySlug);
router.post('/:slug/view', incrementViews);

// Admin protected routes
router.post('/', verifyToken, createArticle);
router.put('/:id', verifyToken, updateArticle);
router.delete('/:id', verifyToken, deleteArticle);

export default router;
