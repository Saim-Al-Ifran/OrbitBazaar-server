import express from 'express';
import { 
    createProduct,
    deleteProduct,
    getAllFeaturedProducts,
    getAllProducts,
    getAllProductsForVendor,
    getSingleProduct,
    toggleProductFeaturedStatus,
    trackProductViewController,
    updatedProduct,
 
} from '../../controllers/product/product.controller';
import authorizeVendor from '../../middlewares/auth/authorizeVendor';
import upload from '../../middlewares/uploadFile/uploadFile';
import authenticate from '../../middlewares/auth/authenticate';
const router  = express.Router();

router.get('/products',getAllProducts);
router.get("/products/featured", getAllFeaturedProducts);
router.get('/products/:id',getSingleProduct);
router.get('/vendor/products',authenticate,authorizeVendor,getAllProductsForVendor);
router.post('/products',authenticate,authorizeVendor,upload.single('image'),createProduct);
router.put('/products/:id',authenticate,authorizeVendor,upload.single('image'),updatedProduct);
router.patch("/products/:id/feature", authenticate, authorizeVendor, toggleProductFeaturedStatus);
router.patch("/products/:id/view", trackProductViewController);
router.delete('/products/:id',authenticate,authorizeVendor,deleteProduct);


export default router;