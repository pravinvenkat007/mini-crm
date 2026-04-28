import { Router } from 'express';
import { createCompany, getCompany, listCompanies } from '../controllers/companyController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);
router.route('/').get(listCompanies).post(createCompany);
router.get('/:id', getCompany);

export default router;
