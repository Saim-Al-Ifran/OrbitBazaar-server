import express from 'express';
import { getDashboardStatsController } from '../../controllers/dashboard/dashboard.controller';
import authenticate from '../../middlewares/auth/authenticate';
import authorizeAdmin from '../../middlewares/auth/authorizeAdmin';
 

const router = express.Router();

router.get('/admin/dashboard/stats',authenticate,authorizeAdmin,getDashboardStatsController);

export default router;
