import express from 'express';
import * as dashboardController from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/stats', dashboardController.getDashboardStats);
router.get('/activity', dashboardController.getRecentActivity);

export default router;
