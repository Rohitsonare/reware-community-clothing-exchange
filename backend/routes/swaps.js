import express from 'express';
import * as swapsController from '../controllers/swapsController.js';
import validate from '../middleware/validate.js';
import { createSwapRequestSchema, updateSwapStatusSchema } from '../validation/swaps.js';

const router = express.Router();

router.post('/request', validate(createSwapRequestSchema), swapsController.createSwapRequest);
router.get('/user', swapsController.getUserSwaps);
router.put('/:id/status', validate(updateSwapStatusSchema), swapsController.updateSwapStatus);

export default router;
