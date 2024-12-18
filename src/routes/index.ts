import { Router } from 'express';
import authRoutes from './auth/auth.route';
const router = Router();

router.use('/api/v1/auth', authRoutes);

export default router;