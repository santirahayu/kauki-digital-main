import express from 'express';
import {
  getInquiries,
  createInquiry,
  updateInquiryServices,
  updateInquiryStatus,
  deleteInquiry,
  exportInquiriesCSV
} from '../controllers/inquiryController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public submission
router.post('/', createInquiry);

// Admin protected endpoints
router.get('/', verifyToken, getInquiries);
router.get('/export-csv', verifyToken, exportInquiriesCSV);
router.patch('/:id/services', verifyToken, updateInquiryServices);
router.patch('/:id/status', verifyToken, updateInquiryStatus);
router.delete('/:id', verifyToken, deleteInquiry);

export default router;
