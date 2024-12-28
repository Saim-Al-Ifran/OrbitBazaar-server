import { Router } from 'express';
import authRoutes from './auth/auth.route';
import userRoutes from './user/user.route';
import categoryRoutes from './category/category.route';
const router = Router();

router.use('/api/v1/auth', authRoutes);
router.use('/api/v1', userRoutes);
router.use('/api/v1', categoryRoutes);

export default router;