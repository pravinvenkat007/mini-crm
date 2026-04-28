import { Router } from 'express';
import { createTask, listTasks, updateTaskStatus } from '../controllers/taskController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);
router.route('/').get(listTasks).post(createTask);
router.patch('/:id/status', updateTaskStatus);

export default router;
