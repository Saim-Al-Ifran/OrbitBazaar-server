import { Router } from 'express';
import authRoutes from './auth/auth.route';
import userRoutes from './user/user.route';
import categoryRoutes from './category/category.route';
import productRoutes from './product/product.route';
import reviewRoute from './review/review.route';
const router = Router();

router.use('/api/v1/auth', authRoutes);
router.use('/api/v1', userRoutes);
router.use('/api/v1', categoryRoutes);
router.use('/api/v1', productRoutes);
router.use('/api/v1', reviewRoute);

export default router;