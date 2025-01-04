import express from 'express';
import { getAllProducts } from '../../controllers/product/product.controller';
const router  = express.Router();

router.get('/products',getAllProducts);

export default router;