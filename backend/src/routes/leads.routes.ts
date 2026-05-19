import express from 'express';
import {
  createLead,
  getLeads,
  getLead,
  updateLead,
  deleteLead,
} from '../controllers/leads.controller';
import { protect, restrictTo } from '../middlewares/auth.middleware';

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

router.route('/').get(getLeads).post(createLead);
router.route('/:id').get(getLead).patch(updateLead).delete(deleteLead);

// Example of Admin only route (if you want to restrict deletion to admins only)
// router.route('/:id').delete(restrictTo('admin'), deleteLead);

export default router;
