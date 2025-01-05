import express from 'express';
import { createProduct, getAllProducts, getSingleProduct } from '../../controllers/product/product.controller';
import authorizeVendor from '../../middlewares/auth/authorizeVendor';
import upload from '../../middlewares/uploadFile/uploadFile';
import authenticate from '../../middlewares/auth/authenticate';
const router  = express.Router();

router.get('/products',getAllProducts);
router.get('/products/:id',getSingleProduct);
router.post('/products',authenticate,authorizeVendor,upload.single('image'),createProduct);

export default router;