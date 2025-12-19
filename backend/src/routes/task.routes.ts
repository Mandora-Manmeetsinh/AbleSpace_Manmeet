import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';

import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const taskController = new TaskController();

router.use(authenticate);

router.post('/', taskController.create);
router.put('/:id', taskController.update);

export default router;
