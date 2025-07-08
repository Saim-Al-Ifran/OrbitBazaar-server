import { Router } from 'express';
import authRoutes from './auth/auth.route';
import userRoutes from './user/user.route';
import categoryRoutes from './category/category.route';
import productRoutes from './product/product.route';
import reviewRoute from './review/review.route';
import wishlistRoute from './wishlist/wishlist.route';
import cartRoute from './cart/cart.route';
import orderRoute from './order/order.route';
import reportRoute from './report/report.route';
import dashboardRoute from './dashboard/dashboard.route';
import paymentRoute from './payment/payment.route';

const router = Router();

router.use('/api/v1/auth', authRoutes);
router.use('/api/v1', userRoutes);
router.use('/api/v1', categoryRoutes);
router.use('/api/v1', productRoutes);
router.use('/api/v1', reviewRoute);
router.use('/api/v1', wishlistRoute);
router.use('/api/v1', cartRoute);
router.use('/api/v1', orderRoute);
router.use('/api/v1', reportRoute);
router.use('/api/v1', dashboardRoute);
router.use('/api/v1',paymentRoute);


export default router;