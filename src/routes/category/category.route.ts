import express from 'express';
import authenticate from '../../middlewares/auth/authenticate';
import authorizeAdmin from '../../middlewares/auth/authorizeAdmin';
import {
    addCategory,
    deleteCategory,
    findAllCategories,
    findAllCategoriesForAdmin,
    getCategoryById,
    updateCategory
} from '../../controllers/category/category.controller';
import upload from '../../middlewares/uploadFile/uploadFile';
 
const router = express.Router();

router.get('/categories',findAllCategories);
router.get('/admin/categories',authenticate,authorizeAdmin,findAllCategoriesForAdmin);
router.get('/admin/categories/:id',authenticate,authorizeAdmin,getCategoryById);
router.post('/admin/categories',authenticate,authorizeAdmin,upload.single('image'),addCategory);
router.put('/admin/categories/:id',authenticate,authorizeAdmin,upload.single('image'),updateCategory);
router.delete('/admin/categories/:id',authenticate,authorizeAdmin,deleteCategory);

export default router;