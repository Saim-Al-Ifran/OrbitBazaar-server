import express from 'express';
import authenticate from '../../middlewares/auth/authenticate';
import authorizeAdmin from '../../middlewares/auth/authorizeAdmin';
import { findAllCategories, findAllCategoriesForAdmin } from '../../controllers/category/category.controller';
 
const router = express.Router();

router.get('/categories',findAllCategories);
router.get('/admin/categories',authenticate,authorizeAdmin,findAllCategoriesForAdmin);
 

export default router;