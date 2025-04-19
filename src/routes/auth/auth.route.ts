import express from 'express';
import {
    adminLogin,
    logout,
    refreshToken,
    registerUser,
    registerVendor,
    userLogin
} from '../../controllers/auth/auth.controller';
const router = express.Router();

router.post('/admin/login',adminLogin);
router.post('/users/login',userLogin);
router.post('/users/register',registerUser);
router.post('/vendors/register', registerVendor);
router.post('/refresh_token',refreshToken);
router.post('/logout',logout);

export default router;