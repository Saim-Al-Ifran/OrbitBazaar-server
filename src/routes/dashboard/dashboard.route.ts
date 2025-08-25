import express from 'express';
 
import authenticate from '../../middlewares/auth/authenticate';
import authorizeAdmin from '../../middlewares/auth/authorizeAdmin';
import authorizeVendor from '../../middlewares/auth/authorizeVendor';
import {
    getDashboardStats,
    getUserDashboardStats,
    getVendorDashboardStats
} from '../../controllers/dashboard/dashboard.controller';
 

const router = express.Router();

router.get('/admin/dashboard/stats',authenticate,authorizeAdmin,getDashboardStats);
router.get('/vendor/dashboard/stats',authenticate,authorizeVendor,getVendorDashboardStats);
router.get('/user/dashboard/stats', authenticate, getUserDashboardStats);

export default router;
