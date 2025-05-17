import express from 'express';
import { 
 
    createProduct,
    deleteProduct,
    getAllFeaturedProducts,
    getAllProducts,
    getAllProductsForVendor,
    getArchivedProducts,
    getSingleProduct,
    getVendorProductDetails,
    searchProducts,
    toggleProductArchivedStatus,
    toggleProductFeaturedStatus,
    trackProductClickController,
    trackProductViewController,
    updatedProduct,
 
} from '../../controllers/product/product.controller';
import authorizeVendor from '../../middlewares/auth/authorizeVendor';
import upload from '../../middlewares/uploadFile/uploadFile';
import authenticate from '../../middlewares/auth/authenticate';
const router  = express.Router();

router.get('/products',getAllProducts);
router.get("/products/featured", getAllFeaturedProducts);
router.get('/products/search',searchProducts);
router.get('/products/archived',authenticate,authorizeVendor,getArchivedProducts);
router.get('/products/:id',getSingleProduct);
router.get('/vendor/products/:id',authenticate,authorizeVendor,getVendorProductDetails);

router.get('/vendor/products',authenticate,authorizeVendor,getAllProductsForVendor);
router.post('/products',authenticate,authorizeVendor,upload.array('images',5),createProduct);
router.put('/products/:id',authenticate,authorizeVendor,upload.array('images',5),updatedProduct);
router.patch("/products/:id/feature", authenticate, authorizeVendor, toggleProductFeaturedStatus);
router.patch("/products/:id/archive", authenticate, authorizeVendor, toggleProductArchivedStatus);

router.patch("/products/:id/view", trackProductViewController);
router.patch("/products/:id/click", trackProductClickController);
router.delete('/products/:id',authenticate,authorizeVendor,deleteProduct);


export default router;