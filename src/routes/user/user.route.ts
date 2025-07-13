import express from 'express';
import authenticate from '../../middlewares/auth/authenticate';
import authorizeAdmin from '../../middlewares/auth/authorizeAdmin';
import {
    changePasswordHandler,
    createUser,
    deleteUser,
    findAllUsers,
    getUserProfile,
    getUserPurchasedProducts,
    updateUserProfileHandler,
    updateUserProfileImage,
    updateUserRole,
    updateUserStatus,
    updateVendorRequestStatus
} from '../../controllers/user/user.controller';
import upload from '../../middlewares/uploadFile/uploadFile';
import authorizeSuperAdmin from '../../middlewares/auth/authorizeSuperAdmin';
 
const router = express.Router();

 
router.get('/admin/users',authenticate,authorizeAdmin,findAllUsers);
router.post('/admin/users',authenticate,authorizeAdmin,createUser);
router.patch('/admin/users/:id/status',authenticate,authorizeAdmin,updateUserStatus);
router.delete('/admin/users/:id',authenticate,authorizeAdmin,deleteUser);
router.delete('/super-admin/entity/:id',authenticate,authorizeSuperAdmin,deleteUser);
router.patch('/super-admin/:id/role',authenticate,authorizeSuperAdmin, updateUserRole );
router.patch('/admin/vendors/:userId/status', authenticate,authorizeAdmin,updateVendorRequestStatus);
router.get('/user/profile', authenticate,getUserProfile);
router.get('/user/purchased-products', authenticate,getUserPurchasedProducts);
router.put('/user/profile-image', authenticate,upload.single('image'),updateUserProfileImage);
router.put('/users/profile',authenticate,updateUserProfileHandler);
router.put('/user/change-password', authenticate, changePasswordHandler);


export default router;