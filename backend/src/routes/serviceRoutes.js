import express from 'express';
import { getServices, createService, updateService, deleteService } from '../controllers/serviceController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getServices);
router.post('/', verifyToken, createService);
router.put('/:id', verifyToken, updateService);
router.delete('/:id', verifyToken, deleteService);

export default router;
