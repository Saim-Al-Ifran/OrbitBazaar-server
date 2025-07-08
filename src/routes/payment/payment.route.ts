import express from 'express';
import authenticate from '../../middlewares/auth/authenticate';
import { createPaymentIntent } from '../../controllers/payment/payment.controller';
const router = express.Router();


router.post('/create_payment_intent',createPaymentIntent);
// router.post('/confirm-payment',authenticate,confirmPayment);
export default router;