import express from 'express';
import {
    addOrder,
    changeOrderStatus,

    getUserOrders,
    getUserSingleOrder,
    vendorOrders
} from '../../controllers/order/order.controller';
import authenticate from '../../middlewares/auth/authenticate';
import authorizeVendor from '../../middlewares/auth/authorizeVendor';
 
const router  = express.Router();
 
router.post('/orders', authenticate ,addOrder);
router.get('/orders/user',authenticate ,getUserOrders);
router.get('/orders/vendor', authenticate, authorizeVendor , vendorOrders);
router.get('/orders/user/:orderId', authenticate , getUserSingleOrder);
router.patch('/orders/:orderId',authenticate, authorizeVendor ,changeOrderStatus);
 


export default router;