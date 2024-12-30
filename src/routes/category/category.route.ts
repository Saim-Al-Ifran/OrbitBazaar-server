import express from 'express';
import authenticate from '../../middlewares/auth/authenticate';
import authorizeAdmin from '../../middlewares/auth/authorizeAdmin';
import { addCategory, findAllCategories, findAllCategoriesForAdmin, updateCategoryController } from '../../controllers/category/category.controller';
import upload from '../../middlewares/uploadFile/uploadFile';
 
const router = express.Router();

router.get('/categories',findAllCategories);
router.get('/admin/categories',authenticate,authorizeAdmin,findAllCategoriesForAdmin);
router.post('/admin/categories',authenticate,authorizeAdmin,upload.single('image'),addCategory);
router.put('/admin/categories/:id',authenticate,authorizeAdmin,upload.single('image'),updateCategoryController);

export default router;