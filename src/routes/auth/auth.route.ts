import express from 'express';
import { adminLogin, refreshToken, registerUser, userLogin } from '../../controllers/auth/auth.controller';
const router = express.Router();

router.post('/admin/login',adminLogin);
router.post('/users/login',userLogin);
router.post('/users/register',registerUser);
router.post('/refresh_token',refreshToken)

export default router;