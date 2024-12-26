import express from 'express';
import authenticate from '../../middlewares/auth/authenticate';
import authorizeAdmin from '../../middlewares/auth/authorizeAdmin';
import { createUser, findAllUsers, updateUserStatus} from '../../controllers/user/user.controller';
const router = express.Router();

 
router.get('/admin/users',authenticate,authorizeAdmin,findAllUsers);
router.post('/admin/users',authenticate,authorizeAdmin,createUser);
router.patch('/admin/users/:id/status',authenticate,authorizeAdmin,updateUserStatus);
 

export default router;