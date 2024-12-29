import express from 'express';
import authenticate from '../../middlewares/auth/authenticate';
import authorizeAdmin from '../../middlewares/auth/authorizeAdmin';
import { findAllCategories } from '../../controllers/category/category.controller';
 
const router = express.Router();

router.get('/categories',findAllCategories);
 

export default router;