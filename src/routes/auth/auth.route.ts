import express from 'express';
import {
    adminLogin,
    firebaseLoginController,
    logout,
    refreshToken,
    registerUser,
    registerVendor,
    resetPassword,
    userLogin
} from '../../controllers/auth/auth.controller';
import authenticate from '../../middlewares/auth/authenticate';
const router = express.Router();

router.post('/admin/login',adminLogin);
router.post('/users/login',userLogin);
router.post('/users/register',registerUser);
router.post('/vendors/register', registerVendor);
router.post('/refresh_token',refreshToken);
router.post('/logout',logout);
router.post('/firebase_login',firebaseLoginController);
router.put('/reset_password',authenticate, resetPassword);

export default router;