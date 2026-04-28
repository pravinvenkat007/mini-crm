import { Router } from 'express';
import {
  createLead,
  deleteLead,
  getLead,
  listLeads,
  updateLead,
} from '../controllers/leadController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);
router.route('/').get(listLeads).post(createLead);
router.route('/:id').get(getLead).put(updateLead).delete(deleteLead);

export default router;
