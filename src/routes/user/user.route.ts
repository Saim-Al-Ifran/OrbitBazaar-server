import express from 'express';
import authenticate from '../../middlewares/auth/authenticate';
import authorizeAdmin from '../../middlewares/auth/authorizeAdmin';
import {
    createUser,
    findAllUsers,
    getUserProfile,
    updateUserStatus,
    updateVendorRequestStatus
} from '../../controllers/user/user.controller';
const router = express.Router();

 
router.get('/admin/users',authenticate,authorizeAdmin,findAllUsers);
router.post('/admin/users',authenticate,authorizeAdmin,createUser);
router.patch('/admin/users/:id/status',authenticate,authorizeAdmin,updateUserStatus);
router.patch('/admin/vendors/:userId/status', authenticate,authorizeAdmin,updateVendorRequestStatus);
router.get('/user/profile', authenticate,getUserProfile);

export default router;