import express from 'express';
import authenticate from '../../middlewares/auth/authenticate';
import {
    addToCart,
    clearCart,
    editCartItem,
    getCart,
    removeCartItem
} from '../../controllers/cart/cart.controller';
 
const router = express.Router();
router.get("/cart", authenticate,getCart );
router.post("/cart",authenticate ,addToCart );
router.delete("/cart",authenticate ,clearCart );
router.put("/cart/item/:productId",authenticate ,editCartItem);
router.delete("/cart/item/:productId",authenticate, removeCartItem );
 

export default router;
